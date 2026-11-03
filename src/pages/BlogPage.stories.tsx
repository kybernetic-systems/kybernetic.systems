import { expect } from "storybook/test";

import { blogPage, posts } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { BlogPage } from "./BlogPage";

const meta = preview.meta({
	title: "Pages/Blog",
	component: BlogPage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/blog" } } } },
	args: { page: blogPage, posts },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<BlogPage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(canvasElement.querySelectorAll("main article")).toHaveLength(posts.length);
	},
});

export const NoPosts = meta.story({
	args: { posts: [] },
	play: async ({ canvas }) => {
		await expect(canvas.getByText("No posts yet.")).toBeVisible();
	},
});
