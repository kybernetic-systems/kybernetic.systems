import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { aboutPage, careersPage, homePage } from "#/content/fixtures";
import preview from "#storybook/preview";

import { NumberedList } from "./NumberedList";
import type { NumberedListProps } from "./NumberedList";

const meta = preview.meta({
	title: "Patterns/NumberedList",
	component: NumberedList,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { items: homePage.principles.items, layout: "grid" } satisfies Partial<NumberedListProps>,
	decorators: [
		(Story) => (
			<Container className="py-12">
				<Story />
			</Container>
		),
	],
});

export const Principles = meta.story({
	play: async ({ canvas }) => {
		const list = canvas.getByRole("list");
		await expect(list.tagName).toBe("OL");
		await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
		await expect(canvas.getByText("01")).toHaveAttribute("aria-hidden", "true");
	},
});

export const HiringSteps = meta.story({
	args: { items: careersPage.hiring.steps, layout: "rows" },
	globals: { tone: "ink" },
});

export const Values = meta.story({
	args: { items: aboutPage.values.items, layout: "stack", numbered: false },
	globals: { tone: "ink" },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("list").tagName).toBe("UL");
		await expect(canvas.queryByText("01")).not.toBeInTheDocument();
	},
});
