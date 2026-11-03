import { expect } from "storybook/test";

import { homePage } from "#/content/fixtures";
import preview from "#storybook/preview";

import { StatementBlock } from "./StatementBlock";

const meta = preview.meta({
	title: "Patterns/StatementBlock",
	component: StatementBlock,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { id: "cause", ...homePage.cause },
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement }) => {
		await expect(canvas.getByRole("region", { name: "Our Cause" })).toBeInTheDocument();
		await expect(canvasElement.querySelector("em")).toHaveTextContent(
			"not merely to survive, but to thrive",
		);
	},
});
