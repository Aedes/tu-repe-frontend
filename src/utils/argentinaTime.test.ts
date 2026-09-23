import { describe, expect, it } from "vitest";
import {
	argentinaDateString,
	argentinaLocalToUtcIso,
	recentArgentinaDays,
} from "./argentinaTime";

describe("hora Argentina", () => {
	it("convierte el horario elegido a UTC", () => {
		expect(argentinaLocalToUtcIso("2026-09-23", "09:00")).toBe(
			"2026-09-23T12:00:00.000Z",
		);
		expect(argentinaLocalToUtcIso("2026-09-23", "11:00")).toBe(
			"2026-09-23T14:00:00.000Z",
		);
		expect(argentinaLocalToUtcIso("2026-09-23", "23:30")).toBe(
			"2026-09-24T02:30:00.000Z",
		);
	});

	it("usa el calendario de Argentina para hoy, ayer y antes de ayer", () => {
		const justBeforeMidnight = new Date("2026-09-24T02:30:00.000Z");
		expect(argentinaDateString(justBeforeMidnight)).toBe("2026-09-23");
		expect(recentArgentinaDays(justBeforeMidnight).map((day) => day.value)).toEqual([
			"2026-09-23",
			"2026-09-22",
			"2026-09-21",
		]);

		const justAfterMidnight = new Date("2026-09-24T03:00:00.000Z");
		expect(argentinaDateString(justAfterMidnight)).toBe("2026-09-24");
		expect(recentArgentinaDays(justAfterMidnight)[0]).toMatchObject({
			value: "2026-09-24",
			label: "Hoy",
			weekday: "jueves",
		});
	});
});
