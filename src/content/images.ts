import type { Picture } from "#/components/primitives/Image/Image";

/*
 * Content images are processed at build time into AVIF and WebP at the widths each slot needs.
 * Keys are paths from the project root, e.g. `/content/people/adit-shah.webp`.
 */
const portraits = import.meta.glob<Picture>("/content/people/*.{avif,jpeg,jpg,png,webp}", {
	eager: true,
	import: "default",
	query: { w: "240;480", format: "avif;webp", as: "picture" },
});

const productMedia = import.meta.glob<Picture>("/content/products/*.{avif,jpeg,jpg,png,webp}", {
	eager: true,
	import: "default",
	query: { w: "560;1120", format: "avif;webp", as: "picture" },
});

function resolve(images: Record<string, Picture>, src: string): Picture {
	const picture = images[src];
	if (!picture) {
		throw new Error(`No image at ${src}. Check the file name in the content's frontmatter.`);
	}
	return picture;
}

export function portraitPicture(src: string): Picture {
	return resolve(portraits, src);
}

export function productPicture(src: string): Picture {
	return resolve(productMedia, src);
}
