import type { Site } from "#/content/api";
import type { JsonLd } from "#/lib/structured-data";

export type PageHeadOptions = {
	site: Site;
	/** Page title; the site name is appended unless `fullTitle` is set. */
	title: string;
	fullTitle?: boolean;
	description?: string | undefined;
	/** Path of the page, e.g. `/blog/complex-domains`. */
	path: string;
	/** Origin the page is served from, when it is not the main site (a product subdomain). */
	origin?: string | undefined;
	type?: "website" | "article";
	image?: { src: string; alt: string; width?: number; height?: number } | undefined;
	noindex?: boolean;
	/** Built by `#/lib/structured-data`, which is where the shape of a block is decided. */
	jsonLd?: JsonLd | JsonLd[];
};

type MetaTag =
	| { title: string }
	| { name: string; content: string }
	| { property: string; content: string };

/** Title, description, canonical URL, Open Graph and Twitter tags, and JSON-LD for a page. */
export function pageHead({
	site,
	title,
	fullTitle = false,
	description = site.description,
	path,
	origin = site.url,
	type = "website",
	image = site.ogImage,
	noindex = false,
	jsonLd,
}: PageHeadOptions) {
	const documentTitle = fullTitle ? title : `${title} · ${site.shortName}`;
	const url = new URL(path, origin).href;
	const imageUrl = new URL(image.src, origin).href;

	const meta: MetaTag[] = [
		{ title: documentTitle },
		{ name: "description", content: description },
		{ property: "og:type", content: type },
		{ property: "og:site_name", content: site.shortName },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:url", content: url },
		{ property: "og:locale", content: "en_US" },
		{ property: "og:image", content: imageUrl },
		{ property: "og:image:alt", content: image.alt },
		{ name: "twitter:card", content: "summary_large_image" },
		// Not in X's card spec, which reads the canonical URL from og:url; emitted because SEO
		// checkers expect it, and it cannot drift because both come from `url`.
		{ name: "twitter:url", content: url },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image", content: imageUrl },
		{ name: "twitter:image:alt", content: image.alt },
	];
	if (image.width && image.height) {
		meta.push(
			{ property: "og:image:width", content: String(image.width) },
			{ property: "og:image:height", content: String(image.height) },
		);
	}
	if (noindex) {
		meta.push({ name: "robots", content: "noindex" });
	}

	return {
		meta,
		links: [{ rel: "canonical", href: url }],
		scripts: jsonLd
			? [
					{
						type: "application/ld+json",
						children: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
					},
				]
			: [],
	};
}
