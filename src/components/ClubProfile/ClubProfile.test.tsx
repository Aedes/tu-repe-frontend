import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ClubProfile from "./ClubProfile"
import { argentinaLocalToUtcIso } from "../../utils/argentinaTime"

const startRender = vi.fn()
let ui: { phase: string; job?: { videoUrl?: string; jobId?: string; reason?: string; parts?: { url: string; startTime: string; endTime: string }[] }; error?: Error } = { phase: "idle" }

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }))
vi.mock("../../hooks/useMatchVideoRender", () => ({
    useMatchVideoRender: () => ({ ui, startRender, refreshUrl: vi.fn() }),
}))
vi.mock("../../hooks/useFetchData", () => ({
    useFetchData: () => ({
        isLoading: false,
        error: null,
        lastErrorRef: { current: null },
        fetchData: vi.fn(async (url: string) => {
            if (String(url).includes("/clubs/")) {
                return {
                    name: "Club Test",
                    openTime: "08:00:00",
                    closeTime: "09:00:00",
                    address: "Calle 1",
                    city: "Ciudad",
                    province: "Provincia",
                    description: "",
                }
            }
            return [{ id: "court-1", name: "Cancha 1" }]
        }),
    }),
}))
vi.mock("../common/TurnstileWidget/TurnstileWidget", () => ({
    default: ({ onToken }: { onToken: (token: string) => void }) => (
        <button type="button" onClick={() => onToken("captcha-token")}>captcha</button>
    ),
}))
vi.mock("./MatchVideoPlayer/MatchVideoPlayer", () => ({
    default: (props: { mode: string }) => <div>player-{props.mode}</div>,
}))

const renderProfile = () => render(
    <MemoryRouter initialEntries={["/c/cluburl01"]}>
        <Routes>
            <Route path="/c/:clubUrlId" element={<ClubProfile />} />
        </Routes>
    </MemoryRouter>
)

describe("ClubProfile", () => {
    beforeEach(() => {
        ui = { phase: "idle" }
        startRender.mockReset()
        startRender.mockResolvedValue("ok")
    })

    it("no busca sin CAPTCHA y consume el token cuando el POST es aceptado", async () => {
        renderProfile()
        await screen.findByText("Club Test")
        const selects = document.querySelectorAll("select")
        fireEvent.change(selects[0], { target: { value: "court-1" } })
        const day = (selects[1].querySelectorAll("option")[1] as HTMLOptionElement).value
        fireEvent.change(selects[1], { target: { value: day } })
        fireEvent.change(selects[2], { target: { value: "08:00" } })
        const button = screen.getByRole("button", { name: /Ver por partes/ })
        expect(button).toBeDisabled()
        fireEvent.click(screen.getByText("captcha"))
        fireEvent.click(button)
        await waitFor(() => expect(startRender).toHaveBeenCalledWith(expect.objectContaining({
            turnstileToken: "captcha-token",
            courtId: "court-1",
            startTime: argentinaLocalToUtcIso(day, "08:00"),
            mode: "parts",
        })))
        await waitFor(() => expect(button).toBeDisabled())
    })

    it("muestra preparación, video único, partes y vacío", async () => {
        ui = { phase: "polling" }
        const { rerender } = renderProfile()
        expect(await screen.findByText(/Preparando tu partido/)).toBeInTheDocument()

        ui = { phase: "ready", job: { videoUrl: "https://videos.test/full.mp4", jobId: "job-1" } }
        rerender(
            <MemoryRouter initialEntries={["/c/cluburl01"]}>
                <Routes><Route path="/c/:clubUrlId" element={<ClubProfile />} /></Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText("player-unified")).toBeInTheDocument()
        expect(screen.queryByText(/Dividido en/)).not.toBeInTheDocument()

        ui = { phase: "parts", job: { parts: [{ url: "https://videos.test/1.mp4", startTime: "a", endTime: "b" }] } }
        rerender(
            <MemoryRouter initialEntries={["/c/cluburl01"]}>
                <Routes><Route path="/c/:clubUrlId" element={<ClubProfile />} /></Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText("player-parts")).toBeInTheDocument()
        expect(screen.getByText(/Tu partido por partes/)).toBeInTheDocument()

        ui = { phase: "fallback", job: { reason: "merge_failed", parts: [{ url: "https://videos.test/1.mp4", startTime: "a", endTime: "b" }] } }
        rerender(
            <MemoryRouter initialEntries={["/c/cluburl01"]}>
                <Routes><Route path="/c/:clubUrlId" element={<ClubProfile />} /></Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText("player-parts")).toBeInTheDocument()
        expect(screen.getByText(/No se pudo unir el video/)).toBeInTheDocument()

        ui = { phase: "not_found" }
        rerender(
            <MemoryRouter initialEntries={["/c/cluburl01"]}>
                <Routes><Route path="/c/:clubUrlId" element={<ClubProfile />} /></Routes>
            </MemoryRouter>
        )
        expect(await screen.findByText(/No encontramos ningún partido/)).toBeInTheDocument()
    })
})
