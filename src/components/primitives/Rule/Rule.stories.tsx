import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Rule } from "./Rule";

const meta = preview.meta({
	title: "Primitives/Rule",
	component: Rule,
	tags: ["autodocs"],
});

export const Hairline = meta.story({});

export const Separator = meta.story({
	args: { separator: true },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("separator")).toBeInTheDocument();
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<Rule />
			<Rule variant="strong" />
			<Rule variant="accent" />
		</ToneMatrix>
	),
});
