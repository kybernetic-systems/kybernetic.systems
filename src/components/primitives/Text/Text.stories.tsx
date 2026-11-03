import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Text } from "./Text";
import type { TextProps } from "./Text";

const meta = preview.meta({
	title: "Primitives/Text",
	component: Text,
	tags: ["autodocs"],
	args: {
		size: "body-lg",
		measure: "lg",
		children:
			"The helmsman does not fight the sea. He reads it — wind, current, drift — and corrects, continuously, toward a heading.",
	} satisfies Partial<TextProps>,
});

export const Default = meta.story({});

export const Lead = meta.story({
	args: {
		size: "lead",
		tone: "muted",
		children: "Working notes on complexity, feedback, and the craft of building software.",
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<Text size="lead" tone="muted">
				Lead · muted
			</Text>
			<Text size="body-lg">Body large · body tone</Text>
			<Text>Body · body tone</Text>
			<Text size="body-sm" tone="subtle">
				Body small · subtle
			</Text>
			<Text tone="default" italic>
				Italic · default tone
			</Text>
		</ToneMatrix>
	),
});
