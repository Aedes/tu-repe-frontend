import React, { useEffect, useRef, useState, type SetStateAction } from "react";
import "./MatchVideoPlayer.css"
import Button from "../../common/Button/Button";
import { DownloadIcon, StartRecordingIcon, StopRecordingIcon, CheckIcon } from "../../../assets/Icons";
import Modal from "../../common/Modal/Modal";
import { toast } from "sonner";
import { ApiError } from "../../../api/http";
import { userFacingError } from "../../../api/errorMessage";
import { BACKEND_API_URL } from "../../../config";
import { useFetchData } from "../../../hooks/useFetchData";
import TurnstileWidget from "../../common/TurnstileWidget/TurnstileWidget";
import { ClipTimelineError, clipOffsetMs } from "../../../utils/clipTimeline";

const MAX_DURATION_MS = 30_000;
const MIN_DURATION_MS = 1_000;

type VideoPart = { url: string; startTime: string; endTime: string }

type ClipContext = {
    clubUrlId: string
    courtId: string
    appointmentStartTime: string
    appointmentEndTime: string
}

type PendingClip = { offsetMs: number; durationMs: number }

type ClipExtractRequest = {
    clubUrlId: string
    courtId: string
    appointmentStartTime: string
    offsetMs: number
    durationMs: number
    turnstileToken: string
}

type Props = ClipContext & ({
    mode: "unified"
    videoUrl: string
    playbackStartTime: string
    onRefreshUrl?: () => Promise<string | null>
} | {
    mode: "parts"
    videos: VideoPart[]
    currentIndex: number
    setCurrentIndex: React.Dispatch<SetStateAction<number>>
})

const MatchVideoPlayer: React.FC<Props> = (props) => {
    const activeUrl = props.mode === "unified" ? props.videoUrl : props.videos[props.currentIndex]?.url
    const isPartsMode = props.mode === "parts"
    const hasMultipleParts = isPartsMode && props.videos.length > 1
    const refreshed = useRef(false)
    const videoRef = useRef<HTMLVideoElement>(null);
    const startOffsetRef = useRef<number | null>(null)
    const selectingRef = useRef(false)
    const finalizingRef = useRef(false)
    const [speed, setSpeed] = useState(1);
    const [isRecording, setIsRecording] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [pendingRange, setPendingRange] = useState<PendingClip | null>(null)
    const [clipError, setClipError] = useState<string | null>(null)
    const [captchaKey, setCaptchaKey] = useState(0)
    const { isLoading: isProcessingClip, fetchData, lastErrorRef } = useFetchData<Blob, ClipExtractRequest>("POST")
    const [clipToken, setClipToken] = useState("")

    useEffect(() => {
        selectingRef.current = false
        finalizingRef.current = false
        startOffsetRef.current = null
        setIsRecording(false)
        setPendingRange(null)
        setClipToken("")
        setClipError(null)
        setIsOpen(false)
    }, [props.appointmentStartTime, props.appointmentEndTime, props.courtId, props.clubUrlId])

    const readOffset = () => {
        const video = videoRef.current
        const currentTimeSeconds = video?.currentTime ?? Number.NaN
        if (props.mode === "unified") {
            const playbackStart = Date.parse(props.playbackStartTime)
            const durationMs = video && Number.isFinite(video.duration) && video.duration > 0 ? video.duration * 1000 : Number.NaN
            const mediaEndTime = Number.isFinite(playbackStart) && Number.isFinite(durationMs)
                ? new Date(playbackStart + durationMs).toISOString()
                : undefined
            return clipOffsetMs({
                mode: "unified",
                currentTimeSeconds,
                appointmentStartTime: props.appointmentStartTime,
                playbackStartTime: props.playbackStartTime,
                mediaEndTime,
            })
        }
        const part = props.videos[props.currentIndex]
        return clipOffsetMs({
            mode: "parts",
            currentTimeSeconds,
            appointmentStartTime: props.appointmentStartTime,
            partStartTime: part?.startTime,
            mediaEndTime: part?.endTime,
        })
    }

    const resetSelection = () => {
        selectingRef.current = false
        finalizingRef.current = false
        startOffsetRef.current = null
        setIsRecording(false)
    }

    const startRecording = async () => {
        if (selectingRef.current) return
        let offset = 0
        try {
            offset = readOffset()
        } catch (error) {
            toast.error(error instanceof ClipTimelineError ? error.message : "No se pudo marcar el clip.")
            return
        }
        const video = videoRef.current
        if (!video) return
        startOffsetRef.current = offset
        selectingRef.current = true
        finalizingRef.current = false
        setIsRecording(true)
        setClipError(null)
        toast.success("Grabando clip...")
        if (video.paused) {
            try {
                await video.play()
            } catch {
                toast.error("No se pudo reproducir el video, pero el inicio del clip quedó marcado.")
            }
        }
    }

    const finalizeClip = (forcedDurationMs?: number) => {
        if (!selectingRef.current || startOffsetRef.current === null || finalizingRef.current) return
        finalizingRef.current = true
        const startOffsetMs = startOffsetRef.current
        let durationMs = forcedDurationMs
        if (durationMs === undefined) {
            let endOffset = startOffsetMs
            try {
                endOffset = readOffset()
            } catch (error) {
                resetSelection()
                toast.error(error instanceof ClipTimelineError ? error.message : "No se pudo marcar el final del clip.")
                return
            }
            if (endOffset <= startOffsetMs) {
                resetSelection()
                toast.error("El final del clip quedó antes del inicio. Volvé a marcarlo.")
                return
            }
            durationMs = Math.min(endOffset - startOffsetMs, MAX_DURATION_MS)
        }
        if (durationMs < MIN_DURATION_MS) {
            resetSelection()
            toast.error("El clip tiene que durar al menos 1 segundo.")
            return
        }
        selectingRef.current = false
        setIsRecording(false)
        videoRef.current?.pause()
        setPendingRange({ offsetMs: startOffsetMs, durationMs })
        setClipToken("")
        setClipError(null)
        setCaptchaKey((value) => value + 1)
        setIsOpen(true)
    }

    const remainingInMedia = () => {
        const appointmentStart = Date.parse(props.appointmentStartTime)
        const startOffset = startOffsetRef.current ?? 0
        if (!Number.isFinite(appointmentStart)) return 0
        if (props.mode === "parts") {
            const end = Date.parse(props.videos[props.currentIndex]?.endTime ?? "")
            if (!Number.isFinite(end)) return 0
            return Math.max(0, end - appointmentStart - startOffset)
        }
        const video = videoRef.current
        const playbackStart = Date.parse(props.playbackStartTime)
        if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || !Number.isFinite(playbackStart)) return 0
        return Math.max(0, playbackStart + video.duration * 1000 - appointmentStart - startOffset)
    }

    const handleTimeUpdate = () => {
        if (!selectingRef.current || startOffsetRef.current === null) return
        try {
            const currentOffset = readOffset()
            if (currentOffset - startOffsetRef.current >= MAX_DURATION_MS) finalizeClip(MAX_DURATION_MS)
        } catch {
            finalizeClip(Math.min(MAX_DURATION_MS, remainingInMedia()))
        }
    }

    const handleEnded = () => {
        if (props.mode === "parts" && props.currentIndex < props.videos.length - 1) {
            props.setCurrentIndex(prev => prev + 1);
            return
        }
        if (selectingRef.current) finalizeClip()
    };

    const handlePlaybackError = async () => {
        if (props.mode !== "unified" || refreshed.current || !props.onRefreshUrl) {
            toast.error("No se pudo reproducir el video.")
            return
        }
        refreshed.current = true
        const nextUrl = await props.onRefreshUrl()
        if (!nextUrl) toast.error("No se pudo renovar el enlace del video.")
    };

    const changeSpeed = (value: number) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = value;
        setSpeed(value);
    };

    const downloadVideo = async () => {
        const response = await fetch(activeUrl);
        const blob = await response.blob();

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = props.mode === "unified" ? "partido-tu-repe.mp4" : `partido_parte_${props.currentIndex + 1}.mp4`;
        a.click();

        URL.revokeObjectURL(a.href);
    };

    const downloadClip = async () => {
        if (!pendingRange) {
            toast.error("Volvé a marcar el clip.")
            return
        }
        if (!clipToken) {
            toast.error("Completá el CAPTCHA para descargar el clip.")
            return
        }
        setClipError(null)
        const mp4Blob = await fetchData(`${BACKEND_API_URL}/clips/extract`, {
            clubUrlId: props.clubUrlId,
            courtId: props.courtId,
            appointmentStartTime: props.appointmentStartTime,
            offsetMs: pendingRange.offsetMs,
            durationMs: pendingRange.durationMs,
            turnstileToken: clipToken,
        })
        setClipToken("")
        setCaptchaKey((value) => value + 1)
        if (!mp4Blob) {
            const failure = lastErrorRef.current
            setClipError(userFacingError(failure, "No se pudo generar el clip"))
            if (failure instanceof ApiError && failure.code === "INVALID_CLIP_RANGE") {
                setPendingRange(null)
            }
            return
        }

        const url = URL.createObjectURL(mp4Blob);
        try {
            const a = document.createElement("a");
            a.href = url;
            a.download = "clip-tu-repe.mp4";
            a.click();
        } finally {
            URL.revokeObjectURL(url);
        }
        setPendingRange(null)
        setIsOpen(false)
        toast.success("Clip generado")
    }

    return (
        <>
            <video
                className="matchVideoPlayer"
                ref={videoRef}
                src={activeUrl}
                controls
                autoPlay
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
                onError={props.mode === "unified" ? () => { void handlePlaybackError() } : undefined}
                crossOrigin="anonymous"
            />
            <div className="controlsContainer">
                <div className="speedControls">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(v => (
                        <button
                            key={v}
                            onClick={() => changeSpeed(v)}
                            className="speedButton"
                            style={{
                                fontWeight: speed === v ? "bold" : "normal",
                                backgroundColor: speed === v ? "#ddd" : "transparent"
                            }}
                        >
                            {v}x
                        </button>
                    ))}
                </div>
                {hasMultipleParts && (
                    <div className="partNavigation" aria-label="Navegación entre partes">
                        <Button
                            margin="0"
                            onClick={() => props.setCurrentIndex((index) => index - 1)}
                            backgroundColor="white"
                            color="#1c67ba"
                            border="1px solid #1c67ba"
                            padding="8px 12px"
                            fontSize="14px"
                            disabled={isRecording || props.currentIndex === 0}
                        >
                            Parte anterior
                        </Button>
                        <span className="partNavigationLabel">
                            Parte {props.currentIndex + 1} de {props.videos.length}
                        </span>
                        <Button
                            margin="0"
                            onClick={() => props.setCurrentIndex((index) => index + 1)}
                            backgroundColor="#1c67ba"
                            color="white"
                            padding="8px 12px"
                            fontSize="14px"
                            disabled={isRecording || props.currentIndex >= props.videos.length - 1}
                        >
                            Parte siguiente
                        </Button>
                    </div>
                )}
                <div className="downloadControl">
                    <Button
                        margin="0"
                        onClick={downloadVideo}
                        backgroundColor="#28a745"
                        color="#fff"
                        padding="10px 15px"
                        fontSize="14px"
                        icon={
                            <DownloadIcon
                                width={16}
                                height={16}
                                fill="white"
                            />
                        }
                    >
                        {props.mode === "unified" ? "Descargar partido" : `Descargar Parte ${props.currentIndex + 1}`}
                    </Button>
                    <Button
                        margin="0"
                        onClick={() => { void startRecording() }}
                        backgroundColor="#007bff"
                        color="#fff"
                        padding="10px 15px"
                        fontSize="14px"
                        icon={
                            <StartRecordingIcon
                                width={18}
                                height={18}
                                fill="white"
                            />
                        }
                        disabled={isRecording}
                    >
                        {isRecording ? "Grabando..." : "Grabar Clip"}
                    </Button>
                    <Button
                        margin="0"
                        onClick={() => finalizeClip()}
                        backgroundColor="red"
                        color="#fff"
                        padding="10px 15px"
                        fontSize="14px"
                        icon={
                            <StopRecordingIcon
                                width={18}
                                height={18}
                                fill="white"
                            />
                        }
                        disabled={!isRecording}
                    >
                        Detener
                    </Button>
                </div>
            </div>
            <Modal isOpen={isOpen}>
                {
                    isProcessingClip ?
                        <div className="processingClip">
                            <div className="spinnerLoading" />
                            <span className="processingClipTitle">Generando clip…</span>
                            <p className="pWait">Esto puede tardar un momento.</p>
                        </div>
                        :
                        <div className="controlsClips">
                            <div className="tileAndIconContainer">
                                <CheckIcon
                                    width={32}
                                    height={32}
                                    fill="#28a745"
                                />
                                <h3 className="controlsClipsTitle">Clip seleccionado correctamente</h3>
                            </div>
                            {clipError && <p className="clipError" role="alert">{clipError}</p>}
                            <TurnstileWidget key={captchaKey} onToken={setClipToken} />
                            <Button
                                padding=".5rem"
                                onClick={() => { void downloadClip() }}
                                backgroundColor="#28a745"
                                color="white"
                                disabled={!clipToken || !pendingRange}
                                icon={
                                    <DownloadIcon
                                        width={20}
                                        height={20}
                                        fill="white"
                                    />
                                }
                            >
                                Descargar clip
                            </Button>
                            <Button
                                padding=".5rem"
                                onClick={() => setIsOpen(false)}
                                backgroundColor="grey"
                                color="white"
                            >
                                Cancelar
                            </Button>
                        </div>
                }
            </Modal>
        </>
    );
}

export default MatchVideoPlayer;
