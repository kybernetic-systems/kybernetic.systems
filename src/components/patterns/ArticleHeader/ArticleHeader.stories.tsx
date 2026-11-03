import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { ArticleByline } from "#/components/patterns/ArticleByline/ArticleByline";
import { post } from "#/content/fixtures";
import preview from "#storybook/preview";

import { ArticleHeader } from "./ArticleHeader";

const meta = preview.meta({
	title: "Patterns/ArticleHeader",
	component: ArticleHeader,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { post },
});

export const Default = meta.story({
	render: (args) => (
		<Container size="article" className="py-12">
			<article>
				<ArticleHeader {...args} />
				<ArticleByline author="Adit Shah" organization="Kybernetic Systems" />
			</article>
		</Container>
	),
	play: async ({ canvasElement }) => {
		await expect(canvasElement.querySelector("time")).toHaveAttribute("datetime", post.publishedAt);
		await expect(canvasElement).toHaveTextContent(post.readingTime);
	},
});
