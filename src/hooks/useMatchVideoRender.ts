import { useEffect, useRef, useState } from "react"
import { ApiError, ensureCsrf, getCookie } from "../api/http"
import { BACKEND_API_URL } from "../config"
import type { MatchRenderMode, MatchRenderResponse, MatchVideoUiState, RenderOutcome } from "../types/matchVideo"

const BACKOFF_MS = [2000, 3000, 5000, 8000, 12000, 15000]
const MAX_POLL_MS = 10 * 60 * 1000

export type RenderRequest = {
    clubUrlId: string
    courtId: string
    startTime: string
    turnstileToken: string
    mode: MatchRenderMode
}

const sleep = (ms: number, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
        signal.removeEventListener("abort", onAbort)
        resolve()
    }, ms)
    const onAbort = () => {
        clearTimeout(timer)
        reject(new DOMException("Aborted", "AbortError"))
    }
    if (signal.aborted) onAbort()
    else signal.addEventListener("abort", onAbort)
})

const readJson = async (response: Response): Promise<MatchRenderResponse> => {
    const payload = await response.json() as MatchRenderResponse & { message?: string; code?: string }
    if (!response.ok) {
        throw new ApiError(response.status, payload.message || `Error: ${response.status}`, payload.code)
    }
    return payload
}

export const useMatchVideoRender = () => {
    const [ui, setUi] = useState<MatchVideoUiState>({ phase: "idle" })
    const abortRef = useRef<AbortController | null>(null)
    const generation = useRef(0)

    useEffect(() => {
        return () => {
            generation.current += 1
            abortRef.current?.abort()
        }
    }, [])

    const apply = (gen: number, response: MatchRenderResponse) => {
        if (gen !== generation.current) return
        if (response.status === "ready") setUi({ phase: "ready", job: response })
        else if (response.status === "parts") setUi({ phase: "parts", job: response })
        else if (response.status === "fallback") setUi({ phase: "fallback", job: response })
        else if (response.status === "not_found") setUi({ phase: "not_found" })
        else setUi({ phase: "polling", job: response })
    }

    const poll = async (jobId: string, gen: number, signal: AbortSignal) => {
        const started = Date.now()
        let attempt = 0
        while (Date.now() - started < MAX_POLL_MS) {
            if (signal.aborted || gen !== generation.current) return
            const response = await fetch(`${BACKEND_API_URL}/videos/render/${jobId}`, {
                credentials: "include",
                cache: "no-store",
                signal,
            })
            if (response.status === 429) {
                const retryAfter = Number(response.headers.get("Retry-After"))
                await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 15_000, signal)
                continue
            }
            const job = await readJson(response)
            apply(gen, job)
            if (job.status === "ready" || job.status === "parts" || job.status === "fallback" || job.status === "not_found") return
            const delay = job.pollAfterMs ?? BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)]
            attempt += 1
            await sleep(delay, signal)
        }
        if (gen === generation.current) {
            setUi({ phase: "failed", error: new Error("La preparación tardó demasiado") })
        }
    }

    const startRender = async (request: RenderRequest): Promise<RenderOutcome> => {
        const gen = ++generation.current
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        setUi({ phase: "submitting" })
        try {
            await ensureCsrf(BACKEND_API_URL)
            const response = await fetch(`${BACKEND_API_URL}/videos/render`, {
                method: "POST",
                credentials: "include",
                cache: "no-store",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": getCookie("tu_repe_csrf"),
                },
                body: JSON.stringify(request),
            })
            if (gen !== generation.current) return "aborted"
            if (response.status === 400) {
                setUi({ phase: "failed", error: new ApiError(400, "Datos inválidos") })
                return "invalid"
            }
            if (response.status === 403) {
                setUi({ phase: "failed", error: new ApiError(403, "Verificación anti-bot fallida") })
                return "captcha"
            }
            if (response.status === 429) {
                setUi({ phase: "failed", error: new ApiError(429, "Demasiadas solicitudes", "RATE_LIMITED") })
                return "retryable"
            }
            const job = await readJson(response)
            apply(gen, job)
            if (job.status === "queued" || job.status === "processing") {
                void poll(job.jobId, gen, controller.signal).catch((error: unknown) => {
                    if ((error as Error).name === "AbortError" || gen !== generation.current) return
                    setUi({ phase: "failed", error: error as Error })
                })
            }
            return "ok"
        } catch (error) {
            if ((error as Error).name === "AbortError" || gen !== generation.current) return "aborted"
            setUi({ phase: "failed", error: error as Error })
            return "retryable"
        }
    }

    const refreshUrl = async (jobId: string): Promise<string | null> => {
        const response = await fetch(`${BACKEND_API_URL}/videos/render/${jobId}`, {
            credentials: "include",
            cache: "no-store",
        })
        if (!response.ok) return null
        const job = await response.json() as MatchRenderResponse
        if (job.status !== "ready") return null
        setUi({ phase: "ready", job })
        return job.videoUrl
    }

    return { ui, startRender, refreshUrl }
}
