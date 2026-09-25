import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { toast } from "sonner"
import { ApiError } from "../../../api/http"
import MatchVideoPlayer from "./MatchVideoPlayer"

const fetchData = vi.hoisted(() => vi.fn())
const lastErrorRef = vi.hoisted(() => ({ current: null as Error | null }))

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }))
vi.mock("../../../hooks/useFetchData", () => ({
    useFetchData: () => ({ isLoading: false, fetchData, lastErrorRef }),
}))
vi.mock("../../common/TurnstileWidget/TurnstileWidget", () => ({
    default: ({ onToken }: { onToken: (token: string) => void }) => (
        <button type="button" onClick={() => onToken("captcha-token")}>captcha-clip</button>
    ),
}))

const START = "2026-01-01T18:00:00.000Z"
const END = "2026-01-01T18:30:00.000Z"

const setMediaTime = (seconds: number) => {
    const video = document.querySelector("video") as HTMLVideoElement
    Object.defineProperty(video, "currentTime", { configurable: true, value: seconds })
    return video
}

describe("MatchVideoPlayer", () => {
    beforeEach(() => {
        fetchData.mockReset()
        lastErrorRef.current = null
        vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined)
        vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined)
    })
    it("reproduce y descarga un único partido", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ blob: async () => new Blob(["video"]) })
        vi.stubGlobal("fetch", fetchMock)
        vi.stubGlobal("URL", { createObjectURL: () => "blob:partido", revokeObjectURL: vi.fn() })
        vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined)
        render(<MatchVideoPlayer mode="unified" videoUrl="https://videos.test/partido.mp4" />)
        const video = document.querySelector("video")
        expect(video).toHaveAttribute("src", "https://videos.test/partido.mp4")
        fireEvent.click(screen.getByRole("button", { name: "Descargar partido" }))
        expect(fetchMock).toHaveBeenCalledWith("https://videos.test/partido.mp4")
    })

    it("conserva la descarga por partes", () => {
        render(
            <MatchVideoPlayer
                mode="parts"
                videos={[{ url: "https://videos.test/parte.mp4", startTime: "a", endTime: "b" }]}
                currentIndex={0}
                setCurrentIndex={vi.fn()}
            />
        )
        expect(screen.getByRole("button", { name: "Descargar Parte 1" })).toBeInTheDocument()
    })

    it("permite navegar entre partes con una barra integrada", () => {
        const videos = [
            { url: "https://videos.test/1.mp4", startTime: "a", endTime: "b" },
            { url: "https://videos.test/2.mp4", startTime: "c", endTime: "d" },
            { url: "https://videos.test/3.mp4", startTime: "e", endTime: "f" },
        ]

        const Harness = () => {
            const [currentIndex, setCurrentIndex] = useState(0)
            return (
                <MatchVideoPlayer
                    mode="parts"
                    videos={videos}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
            )
        }

        render(<Harness />)
        expect(screen.getByText("Parte 1 de 3")).toBeInTheDocument()
        const previous = screen.getByRole("button", { name: "Parte anterior" })
        const next = screen.getByRole("button", { name: "Parte siguiente" })
        expect(previous).toBeDisabled()
        expect(screen.getByRole("button", { name: "Descargar Parte 1" })).toBeInTheDocument()

        fireEvent.click(next)
        expect(screen.getByText("Parte 2 de 3")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Descargar Parte 2" })).toBeInTheDocument()

        fireEvent.click(next)
        expect(screen.getByText("Parte 3 de 3")).toBeInTheDocument()
        expect(next).toBeDisabled()

        fireEvent.click(previous)
        expect(screen.getByText("Parte 2 de 3")).toBeInTheDocument()
        expect(previous).not.toBeDisabled()
    })

    it("renueva una sola vez la URL unificada", async () => {
        const onRefreshUrl = vi.fn().mockResolvedValue("https://videos.test/nueva.mp4")
        const { rerender } = render(
            <MatchVideoPlayer mode="unified" videoUrl="https://videos.test/partido.mp4" onRefreshUrl={onRefreshUrl} />
        )
        const video = document.querySelector("video")!
        fireEvent.error(video)
        fireEvent.error(video)
        expect(onRefreshUrl).toHaveBeenCalledTimes(1)
        rerender(<MatchVideoPlayer mode="unified" videoUrl="https://videos.test/nueva.mp4" onRefreshUrl={onRefreshUrl} />)
        fireEvent.error(document.querySelector("video")!)
        expect(onRefreshUrl).toHaveBeenCalledTimes(1)
    })

    it("marca el offset, calcula la duración y descarga el mp4", async () => {
        fetchData.mockResolvedValue(new Blob(["mp4"], { type: "video/mp4" }))
        const revoke = vi.fn()
        vi.stubGlobal("URL", { createObjectURL: () => "blob:clip", revokeObjectURL: revoke })
        const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined)
        render(
            <MatchVideoPlayer
                mode="unified"
                videoUrl="https://videos.test/partido.mp4"
                playbackStartTime="2026-01-01T17:58:00.000Z"
                clubUrlId="cluburl01"
                courtId="court-1"
                appointmentStartTime={START}
                appointmentEndTime={END}
            />
        )
        setMediaTime(122)
        fireEvent.click(screen.getByRole("button", { name: "Grabar Clip" }))
        expect(screen.getByRole("button", { name: "Grabando..." })).toBeDisabled()
        setMediaTime(130)
        fireEvent.click(screen.getByRole("button", { name: "Detener" }))
        expect(screen.getByRole("heading", { name: "Clip seleccionado correctamente" })).toBeInTheDocument()
        fireEvent.click(screen.getByRole("button", { name: "captcha-clip" }))
        fireEvent.click(screen.getByRole("button", { name: "Descargar clip" }))
        await waitFor(() => expect(fetchData).toHaveBeenCalledWith(
            expect.stringContaining("/clips/extract"),
            {
                clubUrlId: "cluburl01",
                courtId: "court-1",
                appointmentStartTime: START,
                offsetMs: 2_000,
                durationMs: 8_000,
                turnstileToken: "captcha-token",
            }
        ))
        expect(fetchData.mock.calls[0][1]).not.toHaveProperty("url")
        expect(fetchData.mock.calls[0][1]).not.toHaveProperty("b2FilePath")
        expect(click).toHaveBeenCalled()
        expect(revoke).toHaveBeenCalledWith("blob:clip")
        expect(toast.success).toHaveBeenCalledWith("Clip generado")
    })

    it("marca un clip en el tramo anterior al turno", async () => {
        fetchData.mockResolvedValue(new Blob(["mp4"], { type: "video/mp4" }))
        render(
            <MatchVideoPlayer
                mode="unified"
                videoUrl="https://videos.test/partido.mp4"
                playbackStartTime="2026-01-01T17:58:00.000Z"
                clubUrlId="cluburl01"
                courtId="court-1"
                appointmentStartTime={START}
                appointmentEndTime={END}
            />
        )
        setMediaTime(0)
        fireEvent.click(screen.getByRole("button", { name: "Grabar Clip" }))
        setMediaTime(5)
        fireEvent.click(screen.getByRole("button", { name: "Detener" }))
        fireEvent.click(screen.getByRole("button", { name: "captcha-clip" }))
        fireEvent.click(screen.getByRole("button", { name: "Descargar clip" }))
        await waitFor(() => expect(fetchData).toHaveBeenCalledWith(
            expect.stringContaining("/clips/extract"),
            expect.objectContaining({ offsetMs: -120_000, durationMs: 5_000 })
        ))
    })

    it("se detiene a los 30 segundos de contenido aunque la velocidad sea 2x", () => {
        render(
            <MatchVideoPlayer
                mode="unified"
                videoUrl="https://videos.test/partido.mp4"
                playbackStartTime={START}
                clubUrlId="cluburl01"
                courtId="court-1"
                appointmentStartTime={START}
                appointmentEndTime={END}
            />
        )
        setMediaTime(0)
        fireEvent.click(screen.getByRole("button", { name: "Grabar Clip" }))
        fireEvent.click(screen.getByRole("button", { name: "2x" }))
        const video = setMediaTime(10)
        fireEvent.timeUpdate(video)
        expect(screen.getByRole("button", { name: "Grabando..." })).toBeInTheDocument()
        setMediaTime(30)
        fireEvent.timeUpdate(video)
        expect(screen.getByRole("heading", { name: "Clip seleccionado correctamente" })).toBeInTheDocument()
    })

    it("conserva el inicio al avanzar de parte y bloquea la navegación manual", async () => {
        fetchData.mockResolvedValue(new Blob(["mp4"]))
        const videos = [
            { url: "https://videos.test/1.mp4", startTime: START, endTime: "2026-01-01T18:00:10.000Z" },
            { url: "https://videos.test/2.mp4", startTime: "2026-01-01T18:00:10.000Z", endTime: END },
        ]
        const Harness = () => {
            const [currentIndex, setCurrentIndex] = useState(0)
            return (
                <MatchVideoPlayer
                    mode="parts"
                    videos={videos}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    clubUrlId="cluburl01"
                    courtId="court-1"
                    appointmentStartTime={START}
                    appointmentEndTime={END}
                />
            )
        }
        render(<Harness />)
        const next = screen.getByRole("button", { name: "Parte siguiente" })
        expect(next).not.toBeDisabled()
        setMediaTime(1)
        fireEvent.click(screen.getByRole("button", { name: "Grabar Clip" }))
        expect(next).toBeDisabled()
        expect(screen.getByRole("button", { name: "Parte anterior" })).toBeDisabled()
        fireEvent.ended(document.querySelector("video")!)
        expect(screen.getByText("Parte 2 de 2")).toBeInTheDocument()
        setMediaTime(2)
        fireEvent.click(screen.getByRole("button", { name: "Detener" }))
        fireEvent.click(screen.getByRole("button", { name: "captcha-clip" }))
        fireEvent.click(screen.getByRole("button", { name: "Descargar clip" }))
        await waitFor(() => expect(fetchData).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            offsetMs: 1_000,
            durationMs: 11_000,
        })))
    })

    it("deja el rango listo para reintentar salvo que el rango sea inválido", async () => {
        fetchData.mockImplementation(async () => {
            lastErrorRef.current = new ApiError(422, "Faltan fragmentos para generar ese clip", "CLIP_COVERAGE_GAP")
            return null
        })
        render(
            <MatchVideoPlayer
                mode="unified"
                videoUrl="https://videos.test/partido.mp4"
                playbackStartTime={START}
                clubUrlId="cluburl01"
                courtId="court-1"
                appointmentStartTime={START}
                appointmentEndTime={END}
            />
        )
        setMediaTime(1)
        fireEvent.click(screen.getByRole("button", { name: "Grabar Clip" }))
        setMediaTime(4)
        fireEvent.click(screen.getByRole("button", { name: "Detener" }))
        fireEvent.click(screen.getByRole("button", { name: "captcha-clip" }))
        fireEvent.click(screen.getByRole("button", { name: "Descargar clip" }))
        expect(await screen.findByRole("alert")).toHaveTextContent("Faltan fragmentos")
        fireEvent.click(screen.getByRole("button", { name: "captcha-clip" }))
        fireEvent.click(screen.getByRole("button", { name: "Descargar clip" }))
        expect(fetchData).toHaveBeenCalledTimes(2)
        expect(fetchData.mock.calls[1][1]).toMatchObject({ offsetMs: 1_000, durationMs: 3_000 })

        fetchData.mockImplementation(async () => {
            lastErrorRef.current = new ApiError(400, "El rango del clip no es válido", "INVALID_CLIP_RANGE")
            return null
        })
        fireEvent.click(screen.getByRole("button", { name: "captcha-clip" }))
        fireEvent.click(screen.getByRole("button", { name: "Descargar clip" }))
        await screen.findByText(/El rango del clip no es válido/)
        expect(screen.getByRole("button", { name: "Descargar clip" })).toBeDisabled()
    })
})
