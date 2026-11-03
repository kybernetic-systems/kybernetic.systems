import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

/** The shape `vite-imagetools` returns for `?as=picture` imports. */
export type Picture = {
	sources: Record<string, string>;
	img: { src: string; w: number; h: number };
};

const image = tv({
	slots: {
		frame: "block overflow-hidden",
		img: "block size-full object-cover",
	},
	variants: {
		aspect: {
			"1/1": { frame: "aspect-square" },
			"4/5": { frame: "aspect-4/5" },
			"16/10": { frame: "aspect-16/10" },
		},
		position: {
			center: { img: "object-center" },
			top: { img: "object-top" },
			bottom: { img: "object-bottom" },
			left: { img: "object-left" },
			right: { img: "object-right" },
		},
	},
	defaultVariants: { aspect: "4/5", position: "center" },
});

const mimeTypes: Record<string, string> = {
	avif: "image/avif",
	webp: "image/webp",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	png: "image/png",
};

export type ImageProps = VariantProps<typeof image> & {
	picture: Picture;
	/** Required. Use an empty string only for purely decorative images. */
	alt: string;
	/** The rendered width, so the browser can pick a source, e.g. "(min-width: 768px) 240px, 100vw". */
	sizes: string;
	/** Load eagerly, for images visible on first paint. */
	priority?: boolean;
	className?: string | undefined;
};

/** A responsive, cropped image with explicit dimensions to avoid layout shift. */
export function Image({
	picture,
	alt,
	sizes,
	aspect,
	position,
	priority = false,
	className,
}: ImageProps) {
	const slots = image({ aspect, position });
	return (
		<picture className={slots.frame({ className })}>
			{Object.entries(picture.sources).map(([format, srcSet]) => (
				<source key={format} type={mimeTypes[format]} srcSet={srcSet} sizes={sizes} />
			))}
			<img
				src={picture.img.src}
				width={picture.img.w}
				height={picture.img.h}
				alt={alt}
				loading={priority ? "eager" : "lazy"}
				decoding="async"
				className={slots.img()}
			/>
		</picture>
	);
}
