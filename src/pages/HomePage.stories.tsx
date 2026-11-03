import { expect } from "storybook/test";

import { featuredPosts, homePage } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { HomePage } from "./HomePage";

const meta = preview.meta({
	title: "Pages/Home",
	component: HomePage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/" } } } },
	args: { page: homePage, posts: featuredPosts },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<HomePage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(
			canvas.getByRole("region", { name: "Blog" }).querySelectorAll("article"),
		).toHaveLength(3);
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
