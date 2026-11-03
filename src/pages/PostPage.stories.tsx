import { expect } from "storybook/test";

import { blogPage, post, readNext, site } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { PostPage } from "./PostPage";

const meta = preview.meta({
	title: "Pages/Post",
	component: PostPage,
	parameters: {
		layout: "fullscreen",
		tanstack: { router: { route: { path: "/blog/$slug" }, params: { slug: post.slug } } },
	},
	args: { post, page: blogPage, readNext, author: "Adit Shah", organization: site.shortName },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<PostPage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(canvas.getByRole("link", { name: "All posts" })).toHaveAttribute("href", "/blog");
		await expect(
			canvas.getByRole("region", { name: "Read next" }).querySelectorAll("article"),
		).toHaveLength(3);
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
