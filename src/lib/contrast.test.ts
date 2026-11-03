import { describe, expect, it } from "vite-plus/test";

import { contrastRatio, mix, parseHex, wcagLevel } from "./contrast";

const paper = parseHex("#f7f4ed");
const navy = parseHex("#0a1a3a");

describe("contrastRatio", () => {
	it.each([
		["brass-deep on paper", "#8a6934", paper, 4.61],
		["brass on paper", "#a37e44", paper, 3.4],
		["brass on navy", "#a37e44", navy, 4.6],
		["stone on paper", "#6b6357", paper, 5.39],
		["slate on paper", "#2a3550", paper, 11.09],
	])("%s", (_name, foreground, background, expected) => {
		expect(contrastRatio(parseHex(foreground), background)).toBeCloseTo(expected, 2);
	});

	it("is symmetric", () => {
		expect(contrastRatio(paper, navy)).toBe(contrastRatio(navy, paper));
	});

	it("accounts for translucent text", () => {
		expect(contrastRatio(mix(paper, navy, 0.5), navy)).toBeCloseTo(4.77, 2);
		expect(contrastRatio(mix(paper, navy, 0.45), navy)).toBeCloseTo(4.1, 1);
	});
});

describe("parseHex", () => {
	it("rejects malformed colors", () => {
		expect(() => parseHex("#fff")).toThrow('Expected a #rrggbb color, got "#fff"');
	});
});

describe("wcagLevel", () => {
	it.each([
		[7, "AAA"],
		[4.5, "AA"],
		[3.4, "AA large"],
		[2.9, "Fail"],
	] as const)("%d is %s", (ratio, level) => {
		expect(wcagLevel(ratio)).toBe(level);
	});
});
