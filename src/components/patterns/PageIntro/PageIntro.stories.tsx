import { expect } from "storybook/test";

import { careersPage } from "#/content/fixtures";
import preview from "#storybook/preview";

import { PageIntro } from "./PageIntro";

const meta = preview.meta({
	title: "Patterns/PageIntro",
	component: PageIntro,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: careersPage.intro,
});

export const WithLead = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
			careersPage.intro.title,
		);
	},
});

export const TitleOnly = meta.story({
	args: {
		eyebrow: "About",
		title:
			"A company built around one belief: systems that learn, outlive systems that are merely planned.",
		lead: undefined,
		titleWidth: "wide",
	},
});
