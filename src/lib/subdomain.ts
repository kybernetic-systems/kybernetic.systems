import type { LocationRewrite } from "@tanstack/react-router";

/*
 * Products live on their own subdomain but are built and served by this site. The router rewrites
 * the host into a path on the way in (`mangrove.kybernetic.systems/x` → `/mangrove/x`) and back out
 * again when it builds a URL, so one route tree serves both origins. The same rewrite works in
 * development, where `mangrove.localhost:3000` resolves to the dev server.
 */

/** Products served from this route tree, each on the subdomain and path of the same name. */
export const products = { mangrove: { label: "Mangrove" } } as const;

export type ProductSubdomain = keyof typeof products;

function isProduct(value: string | undefined): value is ProductSubdomain {
	return value !== undefined && Object.hasOwn(products, value);
}

function matchedSubdomain(hostname: string): ProductSubdomain | undefined {
	const [label, ...rest] = hostname.split(".");
	// A bare host (`localhost`) has no subdomain to strip.
	if (rest.length === 0 || !isProduct(label)) return undefined;
	return label;
}

/** The host with any product label removed: `mangrove.example.com` → `example.com`. */
function bareHostname(hostname: string): string {
	const subdomain = matchedSubdomain(hostname);
	return subdomain ? hostname.slice(subdomain.length + 1) : hostname;
}

/** The product a path belongs to, if any: `/mangrove/docs` is Mangrove, `/mangroveish` is not. */
export function productForPath(pathname: string): ProductSubdomain | undefined {
	const name = pathname.split("/")[1];
	return isProduct(name) ? name : undefined;
}

/** `mangrove.example.com/docs` → `example.com/mangrove/docs`, for route matching. */
function input({ url }: { url: URL }): URL | undefined {
	const subdomain = matchedSubdomain(url.hostname);
	if (!subdomain) return undefined;
	url.hostname = bareHostname(url.hostname);
	url.pathname = url.pathname === "/" ? `/${subdomain}` : `/${subdomain}${url.pathname}`;
	return url;
}

/**
 * `example.com/mangrove/docs` → `mangrove.example.com/docs`, for URLs the router builds.
 *
 * Two details this has to get right. The URL handed in carries the origin the request arrived on,
 * already the product's subdomain when the page is served there, so the host is rebuilt from the
 * bare one; prepending blindly gives `mangrove.mangrove.example.com` and a redirect loop. And it
 * only applies on hosts that really serve the subdomain, because the server redirects whenever the
 * public URL differs from the one requested: on the published site that is the canonical redirect
 * from `/mangrove` to the subdomain, but anywhere else — the dev server, and the throwaway origin
 * the prerenderer serves from — it would be a redirect off-origin that neither can follow.
 */
function makeOutput(siteHostname: string) {
	return function output({ url }: { url: URL }): URL | undefined {
		const subdomain = productForPath(url.pathname);
		const servesSubdomains =
			url.hostname === siteHostname || matchedSubdomain(url.hostname) !== undefined;
		if (!subdomain || !servesSubdomains) return undefined;
		url.hostname = `${subdomain}.${bareHostname(url.hostname)}`;
		url.pathname = url.pathname.slice(subdomain.length + 1) || "/";
		return url;
	};
}

/** @param siteUrl the published site's address, e.g. `https://kybernetic.systems`. */
export function createSubdomainRewrite(siteUrl: string): LocationRewrite {
	return { input, output: makeOutput(new URL(siteUrl).hostname) };
}

/** The public origin a product's pages are served from, for canonical URLs and Open Graph. */
export function productOrigin(subdomain: ProductSubdomain, siteUrl: string): string {
	const url = new URL(siteUrl);
	url.hostname = `${subdomain}.${url.hostname}`;
	return url.origin;
}

/**
 * The href a link to an internal `path` should carry on a page served from `origin`. Paths that
 * belong to `origin`'s own host stay relative; a path that lives on a sibling host — a product
 * subdomain, or the company seen from one — becomes an absolute URL, because no relative URL can
 * reach a sibling subdomain. This is the `output` rewrite generalized to run in both directions
 * and without its host guard, since the caller chooses the origin.
 */
export function publicHref(path: string, origin: string): string {
	const url = new URL(path, origin);
	const subdomain = productForPath(url.pathname);
	const host = subdomain
		? `${subdomain}.${bareHostname(url.hostname)}`
		: bareHostname(url.hostname);
	if (subdomain) url.pathname = url.pathname.slice(subdomain.length + 1) || "/";
	if (host === url.hostname) return `${url.pathname}${url.search}${url.hash}`;
	url.hostname = host;
	return url.href;
}
