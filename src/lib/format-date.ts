const display = new Intl.DateTimeFormat("en-US", {
	day: "2-digit",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

const long = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
});

/** Parses a `YYYY-MM-DD` calendar date as midnight UTC, so it never shifts a day by time zone. */
function toDate(isoDate: string): Date {
	const date = new Date(`${isoDate}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`Expected a YYYY-MM-DD date, got "${isoDate}"`);
	}
	return date;
}

/** "Jul 12, 2026", as used in post and role metadata. */
export function formatDate(isoDate: string): string {
	return display.format(toDate(isoDate));
}

/** "July 27, 2026", as used in running text such as "Last updated". */
export function formatLongDate(isoDate: string): string {
	return long.format(toDate(isoDate));
}

/** RFC 822 date for RSS. */
export function formatRfc822(isoDate: string): string {
	return toDate(isoDate).toUTCString();
}
