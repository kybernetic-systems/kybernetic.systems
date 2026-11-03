import { expect } from "storybook/test";

import { longTitlePost, postSummary } from "#/content/fixtures";
import preview from "#storybook/preview";

import { PostCard } from "./PostCard";
import type { PostCardProps } from "./PostCard";

const meta = preview.meta({
	title: "Patterns/PostCard",
	component: PostCard,
	tags: ["autodocs"],
	args: { post: postSummary, variant: "featured" } satisfies Partial<PostCardProps>,
	decorators: [
		(Story) => (
			<div className="max-w-sm">
				<Story />
			</div>
		),
	],
});

export const Featured = meta.story({
	play: async ({ canvas }) => {
		const links = canvas.getAllByRole("link");
		await expect(links).toHaveLength(1);
		await expect(links[0]).toHaveAccessibleName(postSummary.title);
		await expect(links[0]).toHaveAttribute("href", `/blog/${postSummary.slug}`);
	},
});

export const Compact = meta.story({ args: { variant: "compact" } });

export const LongTitle = meta.story({ args: { post: longTitlePost } });
