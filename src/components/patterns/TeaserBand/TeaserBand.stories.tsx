import { expect } from "storybook/test";

import { homePage } from "#/content/fixtures";
import preview from "#storybook/preview";

import { TeaserBand } from "./TeaserBand";
import type { TeaserBandProps } from "./TeaserBand";

const meta = preview.meta({
	title: "Patterns/TeaserBand",
	component: TeaserBand,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: {
		id: "products",
		eyebrow: homePage.productsTeaser.eyebrow,
		title: homePage.productsTeaser.title,
		body: homePage.productsTeaser.body,
		link: { label: homePage.productsTeaser.linkLabel, href: homePage.productsTeaser.href },
	} satisfies Partial<TeaserBandProps>,
});

export const Inline = meta.story({
	play: async ({ canvas }) => {
		// A product path resolves onto its own subdomain, whichever host is serving the page.
		await expect(canvas.getByRole("link", { name: "See Mangrove" })).toHaveAttribute(
			"href",
			expect.stringContaining("//mangrove."),
		);
	},
});

export const Split = meta.story({
	args: {
		id: "careers",
		layout: "split",
		eyebrow: homePage.careersTeaser.eyebrow,
		title: homePage.careersTeaser.title,
		body: homePage.careersTeaser.body,
		link: { label: homePage.careersTeaser.linkLabel, href: homePage.careersTeaser.href },
	},
});
