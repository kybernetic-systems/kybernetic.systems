import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Heading } from "./Heading";
import type { HeadingProps } from "./Heading";

const meta = preview.meta({
	title: "Primitives/Heading",
	component: Heading,
	tags: ["autodocs"],
	args: {
		level: 2,
		size: "heading-lg",
		children: "Founding Engineer",
	} satisfies Partial<HeadingProps>,
});

export const Default = meta.story({});

export const LevelIndependentOfSize = meta.story({
	args: { level: 3, size: "display", children: "An h3 that looks like a display heading" },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("heading", { level: 3 })).toHaveClass("text-display");
	},
});

export const LongTitle = meta.story({
	args: {
		size: "heading-xl",
		children:
			"The helmsman's correction: what cybernetics still has to teach software, eighty years later",
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<Heading level={1} size="display-xl">
				Through Learning
			</Heading>
			<Heading level={2} size="display">
				Notes on steering
			</Heading>
			<Heading level={3} size="heading-xl">
				Nothing here fits you?
			</Heading>
			<Heading level={3} size="heading-lg">
				Founding Engineer
			</Heading>
			<Heading level={4} size="heading-md" italic>
				κυβερνήτης
			</Heading>
		</ToneMatrix>
	),
});
