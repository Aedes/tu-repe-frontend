import React, { useRef, useState, type SetStateAction } from "react";
import "./MatchVideoPlayer.css"
import Button from "../../common/Button/Button";
import { DownloadIcon, StartRecordingIcon, StopRecordingIcon, CheckIcon } from "../../../assets/Icons";
import Modal from "../../common/Modal/Modal";
import { toast } from "sonner";
import { userFacingError } from "../../../api/errorMessage";
import { BACKEND_API_URL } from "../../../config";
import { useFetchData } from "../../../hooks/useFetchData";
import TurnstileWidget from "../../common/TurnstileWidget/TurnstileWidget";

type VideoPart = { url: string; startTime: string; endTime: string }

type Props = {
    mode: "unified"
    videoUrl: string
    onRefreshUrl?: () => Promise<string | null>
} | {
    mode: "parts"
    videos: VideoPart[]
    currentIndex: number
    setCurrentIndex: React.Dispatch<SetStateAction<number>>
}

const MatchVideoPlayer: React.FC<Props> = (props) => {
    const activeUrl = props.mode === "unified" ? props.videoUrl : props.videos[props.currentIndex]?.url
    const isPartsMode = props.mode === "parts"
    const hasMultipleParts = isPartsMode && props.videos.length > 1
    const refreshed = useRef(false)
    const videoRef = useRef<HTMLVideoElement>(null);
    const [speed, setSpeed] = useState(1);
    const [isRecording, setIsRecording] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [blob, setBlob] = useState<Blob | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);
    const MAX_DURATION = 30_000;
    const { isLoading: isProcessingClip, fetchData, lastErrorRef } = useFetchData<Blob>("POST")
    const [clipToken, setClipToken] = useState("")

    const getVideoStream = (video: any): MediaStream | null => {
        if (typeof video.captureStream === "function") {
            return video.captureStream();
        }

        if (typeof video.mozCaptureStream === "function") {
            return video.mozCaptureStream();
        }

        return null;
    };

    const removeAudioTrack = (stream: MediaStream) => {
        const videoTracks = stream.getVideoTracks();
        return new MediaStream(videoTracks);
    };

    const getSupportedMimeType = () => {
        const types = [
            "video/webm; codecs=vp9",
            "video/webm; codecs=vp8",
            "video/webm",
        ];

        return types.find(type => MediaRecorder.isTypeSupported(type));
    };

    const startRecording = async () => {
        toast.success("Grabando clip...")
        setIsRecording(true)
        try {
            if (!videoRef.current) return;

            if (videoRef.current.paused) {
                await videoRef.current.play();
            }

            const stream = getVideoStream(videoRef.current);

            if (!stream) {
                toast.error("La grabación no es compatible con este navegador.");
                return;
            }

            const videoOnlyStream = removeAudioTrack(stream)

            const mimeType = getSupportedMimeType();

            if (!mimeType) {
                toast.error("Tu navegador no soporta grabación de video 😕");
                return;
            }

            const mediaRecorder = new MediaRecorder(videoOnlyStream, { mimeType });

            chunks.current = [];

            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) chunks.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: "video/webm" });
                setBlob(blob)
            };

            mediaRecorder.start();
            setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                    stopRecording();
                }
            }, MAX_DURATION);
            mediaRecorderRef.current = mediaRecorder;
        } catch (error) {
            console.error("Error starting recording:", error);
            setIsRecording(false)
            toast.error("Ocurrió un error al iniciar la grabación.");
        }
    };

    const stopRecording = () => {
        setIsRecording(false)
        toast.info("Grabación detenida")
        mediaRecorderRef.current?.stop();
        if (videoRef.current) {
            videoRef.current.pause();
        }
        setIsOpen(true)
    };

    const handleEnded = () => {
        if (props.mode === "parts" && props.currentIndex < props.videos.length - 1) {
            props.setCurrentIndex(prev => prev + 1);
        }
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

    const downloadClip = async (webmBlob: Blob) => {
        if (!clipToken) {
            toast.error("Completá el CAPTCHA para descargar el clip.")
            return
        }
        const file = new File([webmBlob], "clip-tu-repe.webm", {
            type: "video/webm"
        });

        const formData = new FormData();
        formData.append("clip", file);
        formData.append("turnstileToken", clipToken);

        const mp4Blob = await fetchData(`${BACKEND_API_URL}/clips/convert`, formData)
        setClipToken("")
        if (!mp4Blob) {
            toast.error(userFacingError(lastErrorRef.current, "No se pudo procesar el clip"))
            return
        }

        const url = URL.createObjectURL(mp4Blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "clip-tu-repe.mp4";
        a.click();

        URL.revokeObjectURL(url);
        setIsOpen(false)
        toast.success("Clip procesado")
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
                            disabled={props.currentIndex === 0}
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
                            disabled={props.currentIndex >= props.videos.length - 1}
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
                        onClick={startRecording}
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
                        onClick={stopRecording}
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
                            <span className="processingClipTitle">Procesando clip...</span>
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
                                <h3 className="controlsClipsTitle">Clip grabado correctamente</h3>
                            </div>
                            <TurnstileWidget onToken={setClipToken} />
                            <Button
                                padding=".5rem"
                                onClick={() => {
                                    if (blob) {
                                        downloadClip(blob)
                                    }
                                }}
                                backgroundColor="#28a745"
                                color="white"
                                disabled={!clipToken}
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
