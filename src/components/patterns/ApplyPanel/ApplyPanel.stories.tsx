import { expect } from "storybook/test";

import { careersPage, role, site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { ApplyPanel } from "./ApplyPanel";

const meta = preview.meta({
	title: "Patterns/ApplyPanel",
	component: ApplyPanel,
	tags: ["autodocs"],
	args: {
		title: careersPage.rolePage.applyTitle,
		body: careersPage.rolePage.applyBody,
		ctaLabel: careersPage.rolePage.applyCtaLabel,
		email: site.email,
		subject: role.applySubject,
		emailBody: site.mailto.role.body,
	},
	decorators: [
		(Story) => (
			<div className="max-w-80">
				<Story />
			</div>
		),
	],
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		const cta = canvas.getByRole("link", { name: "Register interest (opens your email app)" });
		const href = cta.getAttribute("href") ?? "";
		await expect(href).toMatch(/^mailto:adit\.shah@kybernetic\.systems\?subject=Internship&body=/u);
		await expect(decodeURIComponent(href.split("body=")[1] ?? "")).toBe(site.mailto.role.body);
		await expect(canvas.getByRole("complementary")).toHaveAccessibleName("Interested?");
		await expect(canvas.getByRole("button", { name: "Copy address" })).toBeVisible();
	},
});
