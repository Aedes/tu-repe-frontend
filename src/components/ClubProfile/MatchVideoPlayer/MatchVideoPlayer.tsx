import React, { useRef, useState } from "react";
import "./MatchVideoPlayer.css"
import Button from "../../common/Button/Button";
import { DownloadIcon, StartRecordingIcon, StopRecordingIcon, CheckIcon } from "../../../assets/Icons";
import Modal from "../../common/Modal/Modal";
import { toast } from "sonner";
import { BACKEND_API_URL } from "../../../config";
import { useFetchData } from "../../../hooks/useFetchData";

type Props = {
    videos: string[];
};

const MatchVideoPlayer: React.FC<Props> = ({ videos }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [isRecording, setIsRecording] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [blob, setBlob] = useState<Blob | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);
    const MAX_DURATION = 30_000;
    const { isLoading: isProcessingClip, error, fetchData } = useFetchData<Blob>("POST")

    if (error) {
        console.error(error)
        toast.error("Error al procesar el clip, inténtalo de nuevo más tarde", {
            closeButton: true
        })
    }

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
        if (currentIndex < videos.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const changeSpeed = (value: number) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = value;
        setSpeed(value);
    };

    const downloadVideo = async () => {
        const url = videos[currentIndex];
        const response = await fetch(url);
        const blob = await response.blob();

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `partido_parte_${currentIndex + 1}.mp4`;
        a.click();

        URL.revokeObjectURL(a.href);
    };

    const downloadClip = async (webmBlob: Blob) => {
        const file = new File([webmBlob], "clip-tu-repe.webm", {
            type: "video/webm"
        });

        const formData = new FormData();
        formData.append("clip", file);

        const mp4Blob = await fetchData(`${BACKEND_API_URL}/clips/convert`, formData)

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
                src={videos[currentIndex]}
                controls
                autoPlay
                onEnded={handleEnded}
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
                        Descargar Parte {currentIndex + 1}
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
                            <Button
                                padding=".5rem"
                                onClick={() => {
                                    if (blob) {
                                        downloadClip(blob)
                                    }
                                }}
                                backgroundColor="#28a745"
                                color="white"
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
