import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { PostCard } from "#/components/patterns/PostCard/PostCard";
import { featuredPosts } from "#/content/fixtures";
import preview from "#storybook/preview";

import { Grid } from "./Grid";

const meta = preview.meta({
	title: "Layout/Grid",
	component: Grid,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { children: null },
});

export const ThreeUp = meta.story({
	render: () => (
		<Container className="py-12">
			<Grid>
				{featuredPosts.map((post) => (
					<li key={post.slug}>
						<PostCard post={post} />
					</li>
				))}
			</Grid>
		</Container>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("list").children).toHaveLength(3);
	},
});
