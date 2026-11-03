import { formatDate, formatLongDate } from "#/lib/format-date";

export type TimeProps = {
	/** A `YYYY-MM-DD` calendar date. */
	date: string;
	format?: "short" | "long";
	className?: string | undefined;
};

/** A machine-readable date: "Jul 12, 2026" (short) or "July 27, 2026" (long). */
export function Time({ date, format = "short", className }: TimeProps) {
	return (
		<time dateTime={date} className={className}>
			{format === "long" ? formatLongDate(date) : formatDate(date)}
		</time>
	);
}
