import { expect } from "storybook/test";

import { homePage } from "#/content/fixtures";
import preview from "#storybook/preview";

import { Hero } from "./Hero";

const meta = preview.meta({
	title: "Patterns/Hero",
	component: Hero,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: homePage.hero,
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Through LearningWe Flourish",
		);
		// The mark fades in, so it's present but may not be visible yet.
		const mark = canvas.getByRole("img", { name: homePage.hero.markLabel });
		await expect(mark).toBeInTheDocument();
		/*
		 * `w-mark` sets the width and the height follows the viewBox, which only holds while svgr
		 * strips the `width` and `height` attributes off `mark.svg`. With them the box widens but the
		 * artwork stays 185px tall. Measured from the computed style, since the mark spins and its
		 * bounding rect grows with the rotation.
		 */
		const { width, height } = getComputedStyle(mark);
		await expect(width).toBe(height);
		await expect(Number.parseFloat(width)).toBeGreaterThanOrEqual(200);
	},
});

export const ReducedMotion = meta.story({ globals: { motion: "reduced" } });
