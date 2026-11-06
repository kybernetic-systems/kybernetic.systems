import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Splits the build into one published asset tree per host. Run with `vp run hosts` after
 * `vp build`, or `vp run deploy` to do both and upload the result.
 *
 * The site is published as static assets, and Cloudflare matches assets by path alone. A product
 * lives at a path in the route tree (`/mangrove`) but is served from the root of its own
 * subdomain, so the one built tree has to become one tree per host before it is uploaded: the
 * product's pages are re-rooted, and the company tree redirects the path it no longer serves.
 */
import { parse } from "smol-toml";
import { z } from "zod";

import { siteSchema } from "#/content/schema.ts";
import { isProduct, productOrigin, products } from "#/lib/subdomain.ts";

/** Build metadata that no host should publish. */
const BUILD_ONLY = new Set(["pages.json"]);

/** Written per host, so no host inherits another's copy. */
const PER_HOST = new Set(["robots.txt", "sitemap.xml"]);

/** Hashed filenames: the content behind one never changes, so it never needs revalidating. */
const IMMUTABLE = "public, max-age=31536000, immutable";

/** Stable filenames, which a new build can change underneath: short enough to pick that up. */
const STABLE = "public, max-age=86400";

/**
 * Directories of host-agnostic files every tree needs. The whole of `assets` travels because
 * router chunks load on demand, so a page's HTML names only the ones it starts with.
 */
const SHARED_DIRECTORIES = ["assets/", "og/"];

/** Only `name` and `short_name` are rewritten per host; the rest of the manifest carries over. */
const manifestSchema = z.looseObject({ name: z.string(), short_name: z.string() });

/** A file in a published tree: copied from the build, or generated for the host. */
export type HostFile = { to: string } & ({ from: string } | { content: string });

export type HostPlan = {
	/** Directory under `dist`, and the `assets.directory` of the host's wrangler config. */
	name: string;
	origin: string;
	files: HostFile[];
};

const isShared = (entry: string) =>
	SHARED_DIRECTORIES.some((directory) => entry.startsWith(directory));
const isRootLevel = (entry: string) => !entry.includes("/");

/** The address a prerendered page is served at, under `html_handling: drop-trailing-slash`. */
export function servedPath(entry: string): string {
	if (entry === "index.html") return "/";
	const withoutIndex = entry.replace(/\/index\.html$/, "");
	return `/${withoutIndex === entry ? entry.replace(/\.html$/, "") : withoutIndex}`;
}

/**
 * Crawl rules plus the host's own sitemap. `/404` is left crawlable on purpose: it answers with a
 * `noindex` tag, and a crawler has to be allowed to fetch the page to be told so.
 */
export function robotsTxt(origin: string): string {
	return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
}

/** Every indexable page of one host. The not-found page carries `noindex`, so it is left out. */
export function sitemapXml(origin: string, entries: string[], lastmod: string): string {
	const urls = entries
		.filter((entry) => entry.endsWith(".html") && entry !== "404.html")
		.map((entry) => new URL(servedPath(entry), origin).href)
		.toSorted((a, b) => a.localeCompare(b))
		.map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Sends the paths a product used to be served at to the subdomain that serves them now, so links
 * and search results pointing at `/mangrove` keep working. Cloudflare follows these whether or not
 * an asset matches, which is why the company tree can drop the product's pages entirely.
 */
export function redirectsFile(siteUrl: string): string {
	const lines = Object.keys(products)
		.filter(isProduct)
		.flatMap((product) => {
			const origin = productOrigin(product, siteUrl);
			return [`/${product}  ${origin}/  301`, `/${product}/*  ${origin}/:splat  301`];
		});
	return `${lines.join("\n")}\n`;
}

/** The company manifest renamed for a product, so an installed app is titled after what it opens. */
export function productManifest(manifest: string, label: string): string {
	const parsed = manifestSchema.parse(JSON.parse(manifest));
	return `${JSON.stringify({ ...parsed, name: label, short_name: label }, undefined, 2)}\n`;
}

/**
 * Response headers for one host.
 *
 * Cloudflare serves every asset `max-age=0, must-revalidate` unless told otherwise, so the hashed
 * bundle is revalidated on each page load for nothing. Cache lifetimes are set only where they
 * differ from that default: HTML keeps it, because a page's address stays the same while its
 * content changes. Rules are additive and a header set twice has its values joined with a comma,
 * so `Cache-Control` appears in the narrow rules only, never in the catch-all.
 *
 * `script-src` has to allow inline code: the prerenderer emits the router's serialized state and
 * the JSON-LD block inline, and nonces would need a Worker to generate them. Everything an
 * attacker could otherwise reach for is closed off instead.
 *
 * HSTS deliberately omits `includeSubDomains`. Each product subdomain is served by its own tree
 * with its own copy of this file, so each one asserts the policy for itself, and no subdomain
 * added later is committed to HTTPS before it is ready.
 */
export function headersFile(entries: string[]): string {
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data:",
		"font-src 'self'",
		"connect-src 'self'",
		"manifest-src 'self'",
		"base-uri 'self'",
		"form-action 'none'",
		"frame-ancestors 'none'",
		"object-src 'none'",
	].join("; ");

	const blocks = [
		[
			"# Every response from this host.",
			"/*",
			"  X-Content-Type-Options: nosniff",
			"  Referrer-Policy: strict-origin-when-cross-origin",
			"  X-Frame-Options: DENY",
			"  Cross-Origin-Opener-Policy: same-origin",
			"  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
			"  Strict-Transport-Security: max-age=31536000",
			`  Content-Security-Policy: ${csp}`,
		].join("\n"),
		["# Content-hashed by the build.", "/assets/*", `  Cache-Control: ${IMMUTABLE}`].join("\n"),
	];

	// Icons, the manifest and the social card keep their names between builds, so they are
	// revalidated daily rather than held for a year.
	const stable = entries
		.filter((entry) => /\.(?:png|ico|svg|webmanifest)$/.test(entry) && !entry.startsWith("assets/"))
		.map((entry) => `/${entry}`)
		.toSorted((a, b) => a.localeCompare(b));
	if (stable.length > 0) {
		blocks.push(
			[
				"# Stable names, replaced in place by a build.",
				...stable.flatMap((file) => [file, `  Cache-Control: ${STABLE}`]),
			].join("\n"),
		);
	}

	return `${blocks.join("\n\n")}\n`;
}

/** Which built file belongs in which published tree, and what each tree has written for it. */
export function planHosts(options: {
	entries: string[];
	siteUrl: string;
	manifest: string;
	lastmod: string;
}): HostPlan[] {
	const { entries, siteUrl, manifest, lastmod } = options;
	const productNames = Object.keys(products).filter(isProduct);
	const belongsToProduct = (entry: string) =>
		productNames.some((name) => entry === name || entry.startsWith(`${name}/`));

	const siteFiles = entries
		.filter((entry) => !BUILD_ONLY.has(entry) && !belongsToProduct(entry))
		.map((entry) => ({ to: entry, from: entry }));

	const site: HostPlan = {
		name: "site",
		origin: new URL(siteUrl).origin,
		files: [
			...siteFiles,
			{ to: "_redirects", content: redirectsFile(siteUrl) },
			{ to: "_headers", content: headersFile(siteFiles.map((file) => file.to)) },
		],
	};

	const hosts = productNames.map((name): HostPlan => {
		const origin = productOrigin(name, siteUrl);
		const pages = entries
			.filter((entry) => entry.startsWith(`${name}/`))
			.map((entry) => ({ to: entry.slice(name.length + 1), from: entry }));
		const support = entries.filter(
			(entry) =>
				!BUILD_ONLY.has(entry) &&
				!PER_HOST.has(entry) &&
				entry !== "site.webmanifest" &&
				(isShared(entry) || (isRootLevel(entry) && !entry.endsWith(".html"))),
		);

		const served = [...pages.map((page) => page.to), ...support, "site.webmanifest"];

		return {
			name,
			origin,
			files: [
				...pages,
				...support.map((entry) => ({ to: entry, from: entry })),
				{ to: "site.webmanifest", content: productManifest(manifest, products[name].label) },
				{ to: "_headers", content: headersFile(served) },
				{ to: "robots.txt", content: robotsTxt(origin) },
				{
					to: "sitemap.xml",
					content: sitemapXml(
						origin,
						pages.map((page) => page.to),
						lastmod,
					),
				},
			],
		};
	});

	return [site, ...hosts];
}

async function writePlan(plan: HostPlan, client: string, dist: string) {
	const directory = path.join(dist, plan.name);
	await rm(directory, { recursive: true, force: true });

	// Every directory first: a recursive mkdir racing the copy that needs it can lose.
	const directories = new Set(
		plan.files.map((file) => path.dirname(path.join(directory, file.to))),
	);
	await Promise.all([...directories].map((target) => mkdir(target, { recursive: true })));

	await Promise.all(
		plan.files.map((file) => {
			const destination = path.join(directory, file.to);
			return "content" in file
				? writeFile(destination, file.content)
				: cp(path.join(client, file.from), destination);
		}),
	);
}

async function main() {
	const root = path.resolve(import.meta.dirname, "..");
	const client = path.join(root, "dist/client");

	const [site, manifest, found] = await Promise.all([
		readFile(path.join(root, "content/singletons/site.toml"), "utf8").then((text) =>
			siteSchema.parse(parse(text)),
		),
		readFile(path.join(client, "site.webmanifest"), "utf8"),
		readdir(client, { recursive: true, withFileTypes: true }),
	]);

	const entries = found
		.filter((entry) => entry.isFile())
		.map((entry) => path.relative(client, path.join(entry.parentPath, entry.name)))
		.toSorted((a, b) => a.localeCompare(b));

	const plans = planHosts({
		entries,
		siteUrl: site.url,
		manifest,
		lastmod: new Date().toISOString().slice(0, 10),
	});

	await Promise.all(plans.map((plan) => writePlan(plan, client, path.join(root, "dist"))));
	for (const plan of plans)
		console.log(`dist/${plan.name}: ${plan.files.length} files · ${plan.origin}`);
}

if (process.argv[1] === import.meta.filename) await main();
