export type MatchRenderStatus = "queued" | "processing" | "ready" | "parts" | "fallback" | "not_found"
export type MatchRenderMode = "parts" | "unified"

export type VideoPart = { url: string; startTime: string; endTime: string }

export type MatchRenderResponse =
    | { status: "ready"; jobId?: string; videoUrl: string; urlExpiresAt: string; startTime: string; endTime: string }
    | { status: "queued" | "processing"; jobId: string; pollAfterMs?: number }
    | { status: "parts"; parts: VideoPart[] }
    | { status: "fallback"; reason: "incomplete_sources" | "merge_failed" | "merge_disabled"; jobId?: string; parts: VideoPart[] }
    | { status: "not_found" }

export type MatchVideoUiState =
    | { phase: "idle" }
    | { phase: "submitting" }
    | { phase: "polling"; job: Extract<MatchRenderResponse, { status: "queued" | "processing" }> }
    | { phase: "ready"; job: Extract<MatchRenderResponse, { status: "ready" }> }
    | { phase: "parts"; job: Extract<MatchRenderResponse, { status: "parts" }> }
    | { phase: "fallback"; job: Extract<MatchRenderResponse, { status: "fallback" }> }
    | { phase: "not_found" }
    | { phase: "failed"; error: Error }

export type RenderOutcome = "ok" | "captcha" | "invalid" | "retryable" | "aborted"
