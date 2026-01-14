import React, { useRef, useState } from "react";
import "./MatchVideoPlayer.css"
import Button from "../common/Button/Button";
import { DownloadIcon, StartRecordingIcon, StopRecordingIcon } from "../../assets/Icons";

type Props = {
    videos: string[];
};

const MatchVideoPlayer: React.FC<Props> = ({ videos }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);
    const MAX_DURATION = 30_000;

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
        setIsRecording(true)
        try {
            if (!videoRef.current) return;

            if (videoRef.current.paused) {
                await videoRef.current.play();
            }

            const stream = getVideoStream(videoRef.current);

            if (!stream) {
                alert("La grabación no es compatible con este navegador.");
                return;
            }

            const videoOnlyStream = removeAudioTrack(stream)

            const mimeType = getSupportedMimeType();

            if (!mimeType) {
                alert("Tu navegador no soporta grabación de video 😕");
                return;
            }

            const mediaRecorder = new MediaRecorder(videoOnlyStream, { mimeType });

            chunks.current = [];

            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) chunks.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: "video/webm" });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "clip_tu_repe.webm";
                a.click();

                URL.revokeObjectURL(url);
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
            alert("Ocurrió un error al iniciar la grabación.");
        }
    };

    const stopRecording = () => {
        setIsRecording(false)
        mediaRecorderRef.current?.stop();
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
        </>
    );
}

export default MatchVideoPlayer;
