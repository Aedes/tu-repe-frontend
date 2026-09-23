const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";
const WEEKDAYS = [
	"domingo",
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
];
const DAY_LABELS = ["Hoy", "Ayer", "Antes de ayer"];

function zoneParts(
	date: Date,
	options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormatPart[] {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: ARGENTINA_TIME_ZONE,
		hourCycle: "h23",
		...options,
	}).formatToParts(date);
}

function part(
	parts: Intl.DateTimeFormatPart[],
	type: Intl.DateTimeFormatPartTypes,
): string {
	const value = parts.find((item) => item.type === type)?.value ?? "00";
	if (type === "hour" && value === "24") return "00";
	return value;
}

export function argentinaDateString(date: Date): string {
	const parts = zoneParts(date, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	const year = part(parts, "year");
	const month = part(parts, "month").padStart(2, "0");
	const day = part(parts, "day").padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function addCalendarDays(day: string, delta: number): string {
	const [year, month, date] = day.split("-").map(Number);
	return new Date(Date.UTC(year, month - 1, date + delta))
		.toISOString()
		.slice(0, 10);
}

function weekdayName(day: string): string {
	const noonUtc = new Date(`${day}T12:00:00Z`);
	return WEEKDAYS[noonUtc.getUTCDay()];
}

export function recentArgentinaDays(now = new Date()) {
	const today = argentinaDateString(now);
	return [0, 1, 2].map((offset) => {
		const value = addCalendarDays(today, -offset);
		return {
			value,
			label: DAY_LABELS[offset],
			weekday: weekdayName(value),
		};
	});
}

function offsetAt(instant: Date): number {
	const parts = zoneParts(instant, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
	const wallClockAsUtc = Date.UTC(
		Number(part(parts, "year")),
		Number(part(parts, "month")) - 1,
		Number(part(parts, "day")),
		Number(part(parts, "hour")),
		Number(part(parts, "minute")),
		Number(part(parts, "second")),
	);
	return wallClockAsUtc - instant.getTime();
}

export function argentinaLocalToUtcIso(day: string, time: string): string {
	const [year, month, date] = day.split("-").map(Number);
	const [hour, minute] = time.split(":").map(Number);
	const utcGuess = new Date(Date.UTC(year, month - 1, date, hour, minute, 0));
	return new Date(utcGuess.getTime() - offsetAt(utcGuess)).toISOString();
}
