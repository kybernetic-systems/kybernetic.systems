import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { longTitlePost, postSummary } from "#/content/fixtures";
import preview from "#storybook/preview";

import { PostListItem } from "./PostListItem";

const meta = preview.meta({
	title: "Patterns/PostListItem",
	component: PostListItem,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { post: postSummary },
	decorators: [
		(Story) => (
			<Container className="py-12">
				<Story />
			</Container>
		),
	],
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getAllByRole("link")).toHaveLength(1);
		await expect(canvas.getByRole("heading", { level: 2 })).toHaveTextContent(postSummary.title);
	},
});

export const LongTitle = meta.story({ args: { post: longTitlePost } });
