import { expect } from "storybook/test";

import { contactPage, site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { WriteToUsPanel } from "./WriteToUsPanel";

const meta = preview.meta({
	title: "Patterns/WriteToUsPanel",
	component: WriteToUsPanel,
	tags: ["autodocs"],
	args: { ...contactPage.writeToUs, email: site.email, subject: site.mailto.contact.subject },
	decorators: [
		(Story) => (
			<div className="max-w-lg">
				<Story />
			</div>
		),
	],
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("link", { name: "Write to us (opens your email app)" }),
		).toHaveAttribute("href", "mailto:adit.shah@kybernetic.systems");
		await expect(canvas.getByRole("link", { name: "privacy notice" })).toHaveAttribute(
			"href",
			"/privacy",
		);
	},
});
