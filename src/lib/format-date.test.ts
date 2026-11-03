import { describe, expect, it } from "vite-plus/test";

import { formatDate, formatLongDate, formatRfc822 } from "./format-date";

describe("formatDate", () => {
	it.each([
		["2026-07-12", "Jul 12, 2026"],
		["2026-06-09", "Jun 09, 2026"],
		["2026-09-01", "Sep 01, 2026"],
	])("formats %s as %s", (input, expected) => {
		expect(formatDate(input)).toBe(expected);
	});

	it("rejects invalid dates", () => {
		expect(() => formatDate("12/07/2026")).toThrow('Expected a YYYY-MM-DD date, got "12/07/2026"');
	});
});

describe("formatLongDate", () => {
	it("spells out the month", () => {
		expect(formatLongDate("2026-07-27")).toBe("July 27, 2026");
	});
});

describe("formatRfc822", () => {
	it("formats for RSS", () => {
		expect(formatRfc822("2026-07-12")).toBe("Sun, 12 Jul 2026 00:00:00 GMT");
	});
});
