import { expect } from "storybook/test";

import preview from "#storybook/preview";

import { ContentStatusBadge } from "./ContentStatusBadge";

const meta = preview.meta({
	title: "Primitives/ContentStatusBadge",
	component: ContentStatusBadge,
	tags: ["autodocs"],
	args: { label: "Placeholder copy" },
});

export const Placeholder = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("note")).toHaveTextContent("Dev only · Placeholder copy");
	},
});

export const PendingReview = meta.story({ args: { label: "Pending counsel review" } });
