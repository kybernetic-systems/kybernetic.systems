import { expect } from "storybook/test";

import { careersPage, closedRole, role, site } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { RolePage } from "./RolePage";

const meta = preview.meta({
	title: "Pages/Role",
	component: RolePage,
	parameters: {
		layout: "fullscreen",
		tanstack: { router: { route: { path: "/careers/$slug" }, params: { slug: role.slug } } },
	},
	args: { role, page: careersPage, site },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<RolePage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(canvas.getByRole("navigation", { name: "On this page" })).toBeInTheDocument();
		await expect(
			canvas.getByRole("link", { name: "Register interest (opens your email app)" }),
		).toBeVisible();
	},
});

export const Closed = meta.story({
	args: { role: closedRole },
	play: async ({ canvas, canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(canvas.getByText(/This role is closed/u)).toBeVisible();
		await expect(
			canvas.queryByRole("link", { name: /Register interest/u }),
		).not.toBeInTheDocument();
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
