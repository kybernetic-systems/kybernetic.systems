import { expect } from "storybook/test";

import portrait from "#content/people/adit-shah.webp?w=240;480&format=avif;webp&as=picture";
import preview from "#storybook/preview";

import { Image } from "./Image";
import type { ImageProps } from "./Image";

const meta = preview.meta({
	title: "Primitives/Image",
	component: Image,
	tags: ["autodocs"],
	args: {
		picture: portrait,
		alt: "Adit Shah, sitting on a rock beside a mountain river",
		sizes: "240px",
		aspect: "4/5",
		className: "w-60",
	} satisfies Partial<ImageProps>,
});

export const Portrait = meta.story({
	play: async ({ canvas }) => {
		const img = canvas.getByRole("img", {
			name: "Adit Shah, sitting on a rock beside a mountain river",
		});
		await expect(img).toHaveAttribute("width");
		await expect(img).toHaveAttribute("height");
		await expect(img).toHaveAttribute("loading", "lazy");
	},
});

export const Square = meta.story({ args: { aspect: "1/1" } });

export const Priority = meta.story({
	args: { priority: true },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("img")).toHaveAttribute("loading", "eager");
	},
});
