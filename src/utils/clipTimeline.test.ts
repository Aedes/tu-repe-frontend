import { describe, expect, it } from "vitest"
import { ClipTimelineError, clipOffsetMs } from "./clipTimeline"

const start = "2026-01-01T18:00:00.000Z"
const end = "2026-01-01T18:30:00.000Z"

describe("clipOffsetMs", () => {
    it("ubica un video unificado que empieza antes del turno", () => {
        expect(clipOffsetMs({
            mode: "unified",
            currentTimeSeconds: 122,
            appointmentStartTime: start,
            playbackStartTime: "2026-01-01T17:58:00.000Z",
            mediaEndTime: end,
        })).toBe(2_000)
    })

    it("permite el tramo anterior al turno", () => {
        expect(clipOffsetMs({
            mode: "unified",
            currentTimeSeconds: 0,
            appointmentStartTime: start,
            playbackStartTime: "2026-01-01T17:58:00.000Z",
            mediaEndTime: "2026-01-01T18:13:00.000Z",
        })).toBe(-120_000)
    })

    it("permite el tramo posterior al turno", () => {
        expect(clipOffsetMs({
            mode: "parts",
            currentTimeSeconds: 16 * 60,
            appointmentStartTime: start,
            partStartTime: start,
            mediaEndTime: "2026-01-01T18:20:00.000Z",
        })).toBe(16 * 60 * 1000)
    })

    it("ubica la parte visible", () => {
        expect(clipOffsetMs({
            mode: "parts",
            currentTimeSeconds: 2,
            appointmentStartTime: start,
            partStartTime: "2026-01-01T18:15:00.000Z",
            mediaEndTime: end,
        })).toBe(15 * 60 * 1000 + 2_000)
    })

    it("redondea al milisegundo más cercano", () => {
        expect(clipOffsetMs({
            mode: "unified",
            currentTimeSeconds: 1.0005,
            appointmentStartTime: start,
            playbackStartTime: start,
            mediaEndTime: end,
        })).toBe(1_001)
    })

    it("rechaza un instante fuera del video", () => {
        expect(() => clipOffsetMs({
            mode: "parts",
            currentTimeSeconds: 31 * 60,
            appointmentStartTime: start,
            partStartTime: start,
            mediaEndTime: "2026-01-01T18:15:00.000Z",
        })).toThrow(ClipTimelineError)
        expect(() => clipOffsetMs({
            mode: "unified",
            currentTimeSeconds: 20 * 60,
            appointmentStartTime: start,
            playbackStartTime: start,
            mediaEndTime: "2026-01-01T18:15:00.000Z",
        })).toThrow(/fuera del video/)
    })
})
