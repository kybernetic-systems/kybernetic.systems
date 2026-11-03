import { describe, expect, it } from "vite-plus/test";

import { isExternalHref, isInternalHref, isWithin } from "./href";

describe("isInternalHref", () => {
	it.each([
		["/", true],
		["/blog/post#section", true],
		["/blog/rss.xml", false],
		["//cdn.example.com", false],
		["mailto:a@b.co", false],
		["https://example.com", false],
	])("%s → %s", (href, expected) => {
		expect(isInternalHref(href)).toBe(expected);
	});
});

describe("isExternalHref", () => {
	it.each([
		["https://example.com", true],
		["//example.com", true],
		["/about", false],
		["tel:+917400038006", false],
	])("%s → %s", (href, expected) => {
		expect(isExternalHref(href)).toBe(expected);
	});
});

describe("isWithin", () => {
	it.each([
		["/", "/", true],
		["/about", "/", false],
		["/blog", "/blog", true],
		["/blog/some-post", "/blog", true],
		["/blogroll", "/blog", false],
	])("%s within %s → %s", (pathname, href, expected) => {
		expect(isWithin(pathname, href)).toBe(expected);
	});
});
