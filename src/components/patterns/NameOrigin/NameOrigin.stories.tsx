import { expect } from "storybook/test";

import { homePage } from "#/content/fixtures";
import preview from "#storybook/preview";

import { NameOrigin } from "./NameOrigin";

const meta = preview.meta({
	title: "Patterns/NameOrigin",
	component: NameOrigin,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { id: "name", ...homePage.name },
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByText("κυβερνήτης")).toHaveAttribute("lang", "el");
	},
});
