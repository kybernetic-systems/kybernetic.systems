import { expect } from "storybook/test";

import { productsPage, site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { NotifyCta } from "./NotifyCta";

const meta = preview.meta({
	title: "Patterns/NotifyCta",
	component: NotifyCta,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: {
		...productsPage.notify,
		email: site.email,
		subject: site.mailto.notify.subject,
		emailBody: site.mailto.notify.body,
	},
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		const cta = canvas.getByRole("link", {
			name: "Email us to be notified (opens your email app)",
		});
		// Built from the fixture, so editing the copy does not break the test; what is under test is
		// that the subject and body reach the mailto link encoded, not what they happen to say.
		const subject = encodeURIComponent(site.mailto.notify.subject);
		const body = encodeURIComponent(site.mailto.notify.body);
		await expect(cta).toHaveAttribute(
			"href",
			`mailto:${site.email}?subject=${subject}&body=${body}`,
		);
		await expect(canvas.getByRole("link", { name: "privacy policy" })).toHaveAttribute(
			"href",
			"/privacy",
		);
		await expect(canvas.getByText(site.email, { selector: "a" })).toBeVisible();
	},
});
