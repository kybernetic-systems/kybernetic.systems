import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Eyebrow } from "./Eyebrow";

const meta = preview.meta({
	title: "Primitives/Eyebrow",
	component: Eyebrow,
	tags: ["autodocs"],
	args: { children: "How We Work" },
});

export const Default = meta.story({});

export const AsHeading = meta.story({
	args: { as: "h2", children: "Our Cause" },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("heading", { level: 2, name: "Our Cause" })).toBeVisible();
	},
});

export const Label = meta.story({
	args: { tracking: "label", children: "Who Builds It" },
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<Eyebrow>Eyebrow · accent</Eyebrow>
			<Eyebrow tracking="label">Label · accent</Eyebrow>
			<Eyebrow tracking="meta" tone="muted">
				Meta · muted
			</Eyebrow>
		</ToneMatrix>
	),
});
