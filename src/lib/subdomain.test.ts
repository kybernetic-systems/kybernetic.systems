import { describe, expect, it } from "vitest";

import { createSubdomainRewrite, productOrigin, publicHref } from "./subdomain";

const { input, output } = createSubdomainRewrite("https://kybernetic.systems");

function rewriteIn(href: string) {
	return input?.({ url: new URL(href) })?.toString();
}

function rewriteOut(href: string) {
	return output?.({ url: new URL(href) })?.toString();
}

describe("input", () => {
	it("moves a product subdomain into the path", () => {
		expect(rewriteIn("https://mangrove.kybernetic.systems/")).toBe(
			"https://kybernetic.systems/mangrove",
		);
		expect(rewriteIn("https://mangrove.kybernetic.systems/docs")).toBe(
			"https://kybernetic.systems/mangrove/docs",
		);
	});

	it("keeps the search and hash", () => {
		expect(rewriteIn("https://mangrove.kybernetic.systems/docs?a=1#top")).toBe(
			"https://kybernetic.systems/mangrove/docs?a=1#top",
		);
	});

	it("works on the development host", () => {
		expect(rewriteIn("http://mangrove.localhost:3000/")).toBe("http://localhost:3000/mangrove");
	});

	it("leaves other hosts alone", () => {
		expect(rewriteIn("https://kybernetic.systems/about")).toBeUndefined();
		expect(rewriteIn("http://localhost:3000/mangrove")).toBeUndefined();
		// Not a known product, and not a bare label that happens to match.
		expect(rewriteIn("https://blog.kybernetic.systems/")).toBeUndefined();
		expect(rewriteIn("http://mangrove/")).toBeUndefined();
	});
});

describe("output", () => {
	it("moves a product path back onto its subdomain", () => {
		expect(rewriteOut("https://kybernetic.systems/mangrove")).toBe(
			"https://mangrove.kybernetic.systems/",
		);
		expect(rewriteOut("https://kybernetic.systems/mangrove/docs")).toBe(
			"https://mangrove.kybernetic.systems/docs",
		);
	});

	it("is idempotent when already on the product's own origin", () => {
		// The router hands `output` the origin the request arrived on. Served at
		// mangrove.kybernetic.systems, that origin already carries the label.
		expect(rewriteOut("https://mangrove.kybernetic.systems/mangrove")).toBe(
			"https://mangrove.kybernetic.systems/",
		);
		expect(rewriteOut("http://mangrove.localhost:3000/mangrove/docs")).toBe(
			"http://mangrove.localhost:3000/docs",
		);
	});

	it("leaves other paths alone", () => {
		expect(rewriteOut("https://kybernetic.systems/about")).toBeUndefined();
		// A path that merely starts with the same letters is not the product.
		expect(rewriteOut("https://kybernetic.systems/mangroveish")).toBeUndefined();
	});

	it("stays put on hosts that do not serve the subdomain", () => {
		// The dev server and the prerenderer's throwaway origin render /mangrove in place. Sending
		// them off-origin would be a redirect neither can follow.
		expect(rewriteOut("http://localhost:3000/mangrove")).toBeUndefined();
		expect(rewriteOut("http://localhost:42729/mangrove")).toBeUndefined();
	});

	it("round-trips with input", () => {
		const href = "https://mangrove.kybernetic.systems/docs?a=1#top";
		const internal = rewriteIn(href);
		expect(internal).toBeDefined();
		expect(rewriteOut(internal ?? "")).toBe(href);
	});
});

describe("productOrigin", () => {
	it("builds the public origin of a product site", () => {
		expect(productOrigin("mangrove", "https://kybernetic.systems")).toBe(
			"https://mangrove.kybernetic.systems",
		);
	});
});

describe("publicHref", () => {
	const site = "https://kybernetic.systems";
	const product = "https://mangrove.kybernetic.systems";
	const dev = "http://localhost:3000";
	const devProduct = "http://mangrove.localhost:3000";

	it("keeps a company path relative on the company's own host", () => {
		expect(publicHref("/about", site)).toBe("/about");
		expect(publicHref("/", site)).toBe("/");
		expect(publicHref("/blog?page=2#top", site)).toBe("/blog?page=2#top");
	});

	it("sends a product path to the product's subdomain", () => {
		expect(publicHref("/mangrove", site)).toBe("https://mangrove.kybernetic.systems/");
		expect(publicHref("/mangrove/docs", site)).toBe("https://mangrove.kybernetic.systems/docs");
	});

	it("strips the product prefix on the product's own host", () => {
		expect(publicHref("/mangrove", product)).toBe("/");
		expect(publicHref("/mangrove/docs", product)).toBe("/docs");
	});

	it("sends a company path back to the company from a product host", () => {
		expect(publicHref("/about", product)).toBe("https://kybernetic.systems/about");
		expect(publicHref("/", product)).toBe("https://kybernetic.systems/");
	});

	it("follows whatever host it is given, port and all", () => {
		expect(publicHref("/mangrove", dev)).toBe("http://mangrove.localhost:3000/");
		expect(publicHref("/about", dev)).toBe("/about");
		expect(publicHref("/about", devProduct)).toBe("http://localhost:3000/about");
		expect(publicHref("/mangrove", devProduct)).toBe("/");
	});

	it("does not treat a path that merely starts the same as a product", () => {
		expect(publicHref("/mangroveish", site)).toBe("/mangroveish");
	});
});
