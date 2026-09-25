export class ClipTimelineError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "ClipTimelineError"
    }
}

export type ClipOffsetInput = {
    mode: "unified" | "parts"
    currentTimeSeconds: number
    appointmentStartTime: string
    playbackStartTime?: string
    partStartTime?: string
    mediaEndTime?: string
}

const MEDIA_SLACK_MS = 5

export const clipOffsetMs = (input: ClipOffsetInput) => {
    if (!Number.isFinite(input.currentTimeSeconds) || input.currentTimeSeconds < 0) {
        throw new ClipTimelineError("No se pudo ubicar el video")
    }
    const appointmentStart = Date.parse(input.appointmentStartTime)
    const originIso = input.mode === "unified" ? input.playbackStartTime : input.partStartTime
    const origin = originIso ? Date.parse(originIso) : Number.NaN
    if (!Number.isFinite(appointmentStart) || !Number.isFinite(origin)) {
        throw new ClipTimelineError("No se pudo ubicar el video")
    }
    const absolute = origin + input.currentTimeSeconds * 1000
    const mediaEnd = input.mediaEndTime ? Date.parse(input.mediaEndTime) : Number.NaN
    if (absolute < origin - MEDIA_SLACK_MS || (Number.isFinite(mediaEnd) && absolute > mediaEnd + MEDIA_SLACK_MS)) {
        throw new ClipTimelineError("Ese momento está fuera del video")
    }
    return Math.round(absolute - appointmentStart)
}
