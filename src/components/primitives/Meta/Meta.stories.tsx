import { expect } from "storybook/test";

import { Time } from "#/components/primitives/Time/Time";
import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Meta } from "./Meta";

const meta = preview.meta({
	title: "Primitives/Meta",
	component: Meta,
	tags: ["autodocs"],
	args: { children: "Mumbai · in person" },
});

export const Default = meta.story({});

export const WithDate = meta.story({
	render: () => (
		<Meta>
			<Time date="2026-07-12" /> · Complexity · 6 min read
		</Meta>
	),
	play: async ({ canvasElement }) => {
		const time = canvasElement.querySelector("time");
		await expect(time).toHaveAttribute("datetime", "2026-07-12");
		await expect(time).toHaveTextContent("Jul 12, 2026");
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<Meta>Extra small · muted</Meta>
			<Meta size="sm" tone="accent">
				Small · accent
			</Meta>
			<Meta tracking="meta">Meta tracking</Meta>
		</ToneMatrix>
	),
});
