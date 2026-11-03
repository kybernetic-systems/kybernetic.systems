import { expect } from "storybook/test";

import { careersPage, roles, site } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { CareersPage } from "./CareersPage";

const meta = preview.meta({
	title: "Pages/Careers",
	component: CareersPage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/careers" } } } },
	args: { page: careersPage, roles, site },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<CareersPage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(
			canvas.getByRole("region", { name: "Roles" }).querySelectorAll("article"),
		).toHaveLength(roles.length);
	},
});

export const NoRoles = meta.story({
	args: { roles: [] },
	play: async ({ canvas }) => {
		await expect(canvas.getByText(careersPage.roles.emptyMessage)).toBeVisible();
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
