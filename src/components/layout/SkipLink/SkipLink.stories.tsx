import { expect } from "storybook/test";

import preview from "#storybook/preview";

import { SkipLink } from "./SkipLink";

const meta = preview.meta({
	title: "Layout/SkipLink",
	component: SkipLink,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
});

export const Default = meta.story({
	render: () => (
		<>
			<SkipLink />
			<p className="p-6 font-serif text-body">Press Tab to reveal the skip link.</p>
			<main id="main" tabIndex={-1} className="p-6 font-serif text-body">
				Main content
			</main>
		</>
	),
	play: async ({ canvas, userEvent }) => {
		await userEvent.tab();
		const link = canvas.getByRole("link", { name: "Skip to content" });
		await expect(link).toHaveFocus();
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute("href", "#main");
	},
});
