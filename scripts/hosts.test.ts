import { describe, expect, it } from "vite-plus/test";

import {
	type HostPlan,
	planHosts,
	productManifest,
	redirectsFile,
	robotsTxt,
	servedPath,
	sitemapXml,
} from "./hosts.ts";

const SITE_URL = "https://kybernetic.systems";

/** A build tree with one of everything the split has to decide about. */
const ENTRIES = [
	"404.html",
	"about/index.html",
	"apple-touch-icon.png",
	"assets/global-CYQEyvJ.css",
	"assets/mangrove-Dai1JgRl.js",
	"blog/index.html",
	"blog/rss.xml",
	"favicon.ico",
	"index.html",
	"mangrove/404.html",
	"mangrove/index.html",
	"og/default.png",
	"pages.json",
	"robots.txt",
	"site.webmanifest",
	"sitemap.xml",
];

const MANIFEST = JSON.stringify({
	name: "Kybernetic Systems",
	short_name: "Kybernetic Systems",
	icons: [{ src: "/favicon.ico" }],
	display: "standalone",
});

function plan(name: string): HostPlan {
	const found = planHosts({
		entries: ENTRIES,
		siteUrl: SITE_URL,
		manifest: MANIFEST,
		lastmod: "2026-11-06",
	}).find((host) => host.name === name);
	if (!found) throw new Error(`no plan for ${name}`);
	return found;
}

/** Destination paths, so a test can assert what a tree holds without caring where it came from. */
const destinations = (host: string) => plan(host).files.map((file) => file.to);

/** What a generated file was written with. */
function generated(host: string, to: string): string {
	const file = plan(host).files.find((candidate) => candidate.to === to);
	if (!file || !("content" in file)) throw new Error(`${to} is not generated for ${host}`);
	return file.content;
}

describe("servedPath", () => {
	it("serves the root index at the root", () => {
		expect(servedPath("index.html")).toBe("/");
	});

	it("drops the index segment of a nested page", () => {
		expect(servedPath("about/index.html")).toBe("/about");
		expect(servedPath("careers/internship/index.html")).toBe("/careers/internship");
	});

	it("drops the extension of a page that is not an index", () => {
		expect(servedPath("404.html")).toBe("/404");
	});
});

describe("robotsTxt", () => {
	it("points at the host's own sitemap", () => {
		expect(robotsTxt("https://mangrove.kybernetic.systems")).toContain(
			"Sitemap: https://mangrove.kybernetic.systems/sitemap.xml",
		);
	});

	it("allows crawling, so the not-found page can report its own noindex", () => {
		expect(robotsTxt(SITE_URL)).toContain("Allow: /");
		expect(robotsTxt(SITE_URL)).not.toContain("Disallow");
	});
});

describe("sitemapXml", () => {
	it("lists pages as the addresses they are served at", () => {
		const xml = sitemapXml(SITE_URL, ["index.html", "about/index.html"], "2026-11-06");
		expect(xml).toContain("<loc>https://kybernetic.systems/</loc>");
		expect(xml).toContain("<loc>https://kybernetic.systems/about</loc>");
		expect(xml).toContain("<lastmod>2026-11-06</lastmod>");
	});

	it("leaves out the not-found page, which is noindex", () => {
		expect(sitemapXml(SITE_URL, ["index.html", "404.html"], "2026-11-06")).not.toContain("404");
	});

	it("leaves out anything that is not a page", () => {
		const xml = sitemapXml(
			SITE_URL,
			["index.html", "assets/app.js", "og/default.png"],
			"2026-11-06",
		);
		expect(xml).not.toContain("app.js");
		expect(xml).not.toContain("default.png");
	});
});

describe("redirectsFile", () => {
	it("sends the product's old path to its subdomain, including everything under it", () => {
		expect(redirectsFile(SITE_URL)).toBe(
			[
				"/mangrove  https://mangrove.kybernetic.systems/  301",
				"/mangrove/*  https://mangrove.kybernetic.systems/:splat  301",
				"",
			].join("\n"),
		);
	});
});

describe("productManifest", () => {
	it("renames the app without disturbing the rest", () => {
		const parsed: unknown = JSON.parse(productManifest(MANIFEST, "Mangrove"));
		expect(parsed).toMatchObject({
			name: "Mangrove",
			short_name: "Mangrove",
			icons: [{ src: "/favicon.ico" }],
			display: "standalone",
		});
	});
});

describe("planHosts", () => {
	it("plans one tree per host", () => {
		expect(
			planHosts({
				entries: ENTRIES,
				siteUrl: SITE_URL,
				manifest: MANIFEST,
				lastmod: "2026-11-06",
			}).map((host) => [host.name, host.origin]),
		).toEqual([
			["site", "https://kybernetic.systems"],
			["mangrove", "https://mangrove.kybernetic.systems"],
		]);
	});

	it("keeps the product's pages out of the company tree, which redirects them instead", () => {
		expect(destinations("site")).not.toContain("mangrove/index.html");
		expect(destinations("site")).not.toContain("mangrove/404.html");
		expect(destinations("site")).toContain("_redirects");
	});

	it("publishes no build metadata", () => {
		expect(destinations("site")).not.toContain("pages.json");
		expect(destinations("mangrove")).not.toContain("pages.json");
	});

	it("re-roots the product's pages, so its index is served at the root", () => {
		expect(plan("mangrove").files).toContainEqual({
			to: "index.html",
			from: "mangrove/index.html",
		});
		expect(plan("mangrove").files).toContainEqual({ to: "404.html", from: "mangrove/404.html" });
	});

	it("carries the shared bundle and icons into the product tree", () => {
		// The whole of `assets` travels: router chunks load on demand and are not named in the HTML.
		expect(destinations("mangrove")).toContain("assets/global-CYQEyvJ.css");
		expect(destinations("mangrove")).toContain("assets/mangrove-Dai1JgRl.js");
		expect(destinations("mangrove")).toContain("og/default.png");
		expect(destinations("mangrove")).toContain("favicon.ico");
		expect(destinations("mangrove")).toContain("apple-touch-icon.png");
	});

	it("leaves the company's own pages and feed out of the product tree", () => {
		expect(destinations("mangrove")).not.toContain("about/index.html");
		expect(destinations("mangrove")).not.toContain("blog/index.html");
		expect(destinations("mangrove")).not.toContain("blog/rss.xml");
	});

	it("writes each host its own crawl rules rather than copying the company's", () => {
		expect(plan("mangrove").files).not.toContainEqual({ to: "robots.txt", from: "robots.txt" });
		expect(generated("mangrove", "robots.txt")).toContain(
			"Sitemap: https://mangrove.kybernetic.systems/sitemap.xml",
		);
		// The company's are already correct for its own host, so they are copied as built.
		expect(plan("site").files).toContainEqual({ to: "robots.txt", from: "robots.txt" });
		expect(plan("site").files).toContainEqual({ to: "sitemap.xml", from: "sitemap.xml" });
	});

	it("lists only the product's own pages in the product sitemap", () => {
		const xml = generated("mangrove", "sitemap.xml");
		expect(xml).toContain("<loc>https://mangrove.kybernetic.systems/</loc>");
		expect(xml).not.toContain("/about");
		expect(xml).not.toContain("404");
	});

	it("titles the product's installed app after the product", () => {
		expect(generated("mangrove", "site.webmanifest")).toContain('"name": "Mangrove"');
		expect(plan("mangrove").files).not.toContainEqual({
			to: "site.webmanifest",
			from: "site.webmanifest",
		});
	});

	it("gives every destination exactly one source", () => {
		for (const host of ["site", "mangrove"]) {
			expect(destinations(host)).toHaveLength(new Set(destinations(host)).size);
		}
	});
});
