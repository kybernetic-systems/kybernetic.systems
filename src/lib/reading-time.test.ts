import { describe, expect, it } from "vite-plus/test";

import { readingTime } from "./reading-time";

describe("readingTime", () => {
	it("never reports less than a minute", () => {
		expect(readingTime("")).toBe("1 min read");
		expect(readingTime("A few words.")).toBe("1 min read");
	});

	it("rounds up", () => {
		expect(readingTime(Array.from({ length: 231 }, () => "word").join(" "))).toBe("2 min read");
	});
});
