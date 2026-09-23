import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import MatchVideoPlayer from "./MatchVideoPlayer"

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }))
vi.mock("../../../hooks/useFetchData", () => ({
    useFetchData: () => ({ isLoading: false, fetchData: vi.fn(), lastErrorRef: { current: null } }),
}))
vi.mock("../../common/TurnstileWidget/TurnstileWidget", () => ({
    default: () => <div>captcha-clip</div>,
}))

describe("MatchVideoPlayer", () => {
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
})
