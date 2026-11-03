import { expect } from "storybook/test";

import { site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { SiteFooter } from "./SiteFooter";

const meta = preview.meta({
	title: "Layout/SiteFooter",
	component: SiteFooter,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { site, grievanceOfficer: "Adit Shah", year: 2026 },
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByText(site.cin)).toBeVisible();
		await expect(canvas.getByRole("link", { name: site.email })).toHaveAttribute(
			"href",
			`mailto:${site.email}`,
		);
		await expect(canvas.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
		await expect(canvas.getByText(/Section 12, Companies Act 2013/u)).toBeVisible();
	},
});
