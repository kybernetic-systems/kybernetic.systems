/** An sRGB color as 0–255 channels. */
export type Rgb = readonly [red: number, green: number, blue: number];

/** Parses a `#rrggbb` hex color. */
export function parseHex(hex: string): Rgb {
	const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
	if (!match) {
		throw new Error(`Expected a #rrggbb color, got "${hex}"`);
	}
	const [, red = "", green = "", blue = ""] = match;
	return [Number.parseInt(red, 16), Number.parseInt(green, 16), Number.parseInt(blue, 16)];
}

/** Composites `foreground` at `alpha` (0–1) over an opaque `background`. */
export function mix(foreground: Rgb, background: Rgb, alpha: number): Rgb {
	const channel = (index: 0 | 1 | 2) =>
		Math.round(foreground[index] * alpha + background[index] * (1 - alpha));
	return [channel(0), channel(1), channel(2)];
}

function linear(value: number): number {
	const srgb = value / 255;
	return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function luminance([red, green, blue]: Rgb): number {
	return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
}

/** WCAG 2.x contrast ratio between two opaque colors, from 1 to 21. */
export function contrastRatio(first: Rgb, second: Rgb): number {
	const [lighter, darker] = [luminance(first), luminance(second)].toSorted((a, b) => b - a);
	return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
}

/** The strictest WCAG level a ratio meets for normal-size text. */
export function wcagLevel(ratio: number): "AAA" | "AA" | "AA large" | "Fail" {
	if (ratio >= 7) return "AAA";
	if (ratio >= 4.5) return "AA";
	if (ratio >= 3) return "AA large";
	return "Fail";
}
