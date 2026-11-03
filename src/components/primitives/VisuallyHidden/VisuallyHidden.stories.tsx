import { expect } from "storybook/test";

import preview from "#storybook/preview";

import { VisuallyHidden } from "./VisuallyHidden";

const meta = preview.meta({
	title: "Primitives/VisuallyHidden",
	component: VisuallyHidden,
	tags: ["autodocs"],
});

export const Default = meta.story({
	render: () => (
		<button type="button" className="border border-rule-strong px-4 py-2">
			<span aria-hidden="true">→</span>
			<VisuallyHidden>Next post</VisuallyHidden>
		</button>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("button", { name: "Next post" })).toBeVisible();
	},
});
