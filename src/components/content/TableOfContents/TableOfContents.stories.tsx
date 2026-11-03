import { expect } from "storybook/test";

import { privacy } from "#/content/fixtures";
import preview from "#storybook/preview";

import { TableOfContents } from "./TableOfContents";

const meta = preview.meta({
	title: "Content/TableOfContents",
	component: TableOfContents,
	tags: ["autodocs"],
	args: { label: "Contents", items: privacy.sections },
});

export const Inline = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: /Who we are/u })).toHaveAttribute(
			"href",
			"#who-we-are",
		);
	},
});

export const Sticky = meta.story({
	args: { sticky: true },
	play: async ({ canvasElement }) => {
		const visibleNavs = [...canvasElement.querySelectorAll("nav")].filter((nav) =>
			nav.checkVisibility(),
		);
		// Below lg the list sits in a closed disclosure; at lg it's a visible sidebar.
		await expect(visibleNavs).toHaveLength(window.innerWidth >= 1024 ? 1 : 0);
	},
});
