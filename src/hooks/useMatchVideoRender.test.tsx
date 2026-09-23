import { act, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { useMatchVideoRender } from "./useMatchVideoRender"

const ready = {
    status: "ready",
    jobId: "job-1",
    videoUrl: "https://videos.test/partido.mp4",
    urlExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    startTime: "2026-01-01T18:00:00.000Z",
    endTime: "2026-01-01T19:00:00.000Z",
}

const Harness = () => {
    const { ui, startRender } = useMatchVideoRender()
    return (
        <div>
            <p data-testid="phase">{ui.phase}</p>
            <p data-testid="url">{ui.phase === "ready" ? ui.job.videoUrl : ""}</p>
            <button onClick={() => void startRender({
                clubUrlId: "cluburl01",
                courtId: "court",
                startTime: "2026-01-01T18:00:00.000Z",
                turnstileToken: "token",
                mode: "unified",
            })}>buscar</button>
        </div>
    )
}

describe("useMatchVideoRender", () => {
    beforeEach(() => {
        document.cookie = "tu_repe_csrf=token"
        vi.stubGlobal("fetch", vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    it("muestra el video cuando ya está listo", async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(ready), { status: 200 }))
        render(<Harness />)
        screen.getByText("buscar").click()
        await waitFor(() => expect(screen.getByTestId("phase")).toHaveTextContent("ready"))
        expect(screen.getByTestId("url")).toHaveTextContent("partido.mp4")
        expect(fetch).toHaveBeenCalledTimes(1)
    })

    it("consulta el trabajo hasta que está listo", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(new Response(JSON.stringify({ status: "queued", jobId: "job-1", pollAfterMs: 5 }), { status: 202 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ status: "processing", jobId: "job-1", pollAfterMs: 5 }), { status: 202 }))
            .mockResolvedValueOnce(new Response(JSON.stringify(ready), { status: 200 }))
        render(<Harness />)
        screen.getByText("buscar").click()
        await waitFor(() => expect(screen.getByTestId("phase")).toHaveTextContent("ready"))
        expect(fetch).toHaveBeenCalledTimes(3)
    })

    it("expone parts, fallback y not_found", async () => {
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({
            status: "parts",
            parts: [{ url: "https://videos.test/parte.mp4", startTime: "a", endTime: "b" }],
        }), { status: 200 }))
        const { rerender } = render(<Harness />)
        screen.getByText("buscar").click()
        await waitFor(() => expect(screen.getByTestId("phase")).toHaveTextContent("parts"))

        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({
            status: "fallback",
            reason: "incomplete_sources",
            parts: [{ url: "https://videos.test/parte.mp4", startTime: "a", endTime: "b" }],
        }), { status: 200 }))
        rerender(<Harness />)
        screen.getByText("buscar").click()
        await waitFor(() => expect(screen.getByTestId("phase")).toHaveTextContent("fallback"))

        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ status: "not_found" }), { status: 200 }))
        rerender(<Harness />)
        screen.getByText("buscar").click()
        await waitFor(() => expect(screen.getByTestId("phase")).toHaveTextContent("not_found"))
    })

    it("respeta 429 y corta al desmontar", async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(new Response(JSON.stringify({ status: "queued", jobId: "job-1", pollAfterMs: 5 }), { status: 202 }))
            .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "Retry-After": "1" } }))
            .mockResolvedValueOnce(new Response(JSON.stringify(ready), { status: 200 }))
        const view = render(<Harness />)
        screen.getByText("buscar").click()
        await waitFor(() => expect(screen.getByTestId("phase")).toHaveTextContent("ready"), { timeout: 4000 })
        view.unmount()
    })

    it("falla si la preparación supera el máximo", async () => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] })
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ status: "processing", jobId: "job-1", pollAfterMs: 1000 }), { status: 202 }))
        render(<Harness />)
        await act(async () => {
            screen.getByText("buscar").click()
            await vi.advanceTimersByTimeAsync(10 * 60 * 1000 + 5_000)
        })
        expect(screen.getByTestId("phase")).toHaveTextContent("failed")
    })
})
