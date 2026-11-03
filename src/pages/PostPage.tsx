import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Grid } from "#/components/layout/Grid/Grid";
import { Section } from "#/components/layout/Section/Section";
import { ArticleByline } from "#/components/patterns/ArticleByline/ArticleByline";
import { ArticleHeader } from "#/components/patterns/ArticleHeader/ArticleHeader";
import { PostCard } from "#/components/patterns/PostCard/PostCard";
import { ArrowLink } from "#/components/primitives/ArrowLink/ArrowLink";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import type { BlogPage, Post, PostSummary } from "#/content/api";

export type PostPageProps = {
	post: Post;
	page: Pick<BlogPage, "backLabel" | "readNextEyebrow">;
	readNext: PostSummary[];
	author: string;
	organization: string;
};

export function PostPage({ post, page, readNext, author, organization }: PostPageProps) {
	return (
		<>
			<Container className="pt-12 md:pt-17.5">
				<ArrowLink href="/blog" appearance="label" direction="back">
					{page.backLabel}
				</ArrowLink>
			</Container>
			<Container size="article" className="pt-12 md:pt-16">
				<article>
					<ArticleHeader post={post} />
					<Prose content={post.body} />
					<ArticleByline author={author} organization={organization} />
				</article>
			</Container>
			{readNext.length > 0 && (
				<Section spacing="md" labelledBy="read-next">
					<Container>
						<Eyebrow as="h2" id="read-next" className="mb-10">
							{page.readNextEyebrow}
						</Eyebrow>
						<Grid>
							{readNext.map((next) => (
								<li key={next.slug}>
									<PostCard post={next} variant="compact" />
								</li>
							))}
						</Grid>
					</Container>
				</Section>
			)}
		</>
	);
}
