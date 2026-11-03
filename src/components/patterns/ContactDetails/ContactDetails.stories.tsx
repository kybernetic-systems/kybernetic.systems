import { expect } from "storybook/test";

import { contactPage, site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { ContactDetails } from "./ContactDetails";

const meta = preview.meta({
	title: "Patterns/ContactDetails",
	component: ContactDetails,
	tags: ["autodocs"],
	args: { site, labels: contactPage.details },
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: site.phone.display })).toHaveAttribute(
			"href",
			`tel:${site.phone.e164}`,
		);
		await expect(canvas.getAllByRole("term").map((term) => term.textContent)).toEqual([
			"Email",
			"Telephone",
			"Registered office",
			"Queries & grievances",
		]);
	},
});
