import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { PageIntro } from "#/components/patterns/PageIntro/PageIntro";
import { PostListItem } from "#/components/patterns/PostListItem/PostListItem";
import { Text } from "#/components/primitives/Text/Text";
import type { BlogPage as BlogPageContent, PostSummary } from "#/content/api";

export type BlogPageProps = {
	page: BlogPageContent;
	posts: PostSummary[];
};

export function BlogPage({ page, posts }: BlogPageProps) {
	return (
		<>
			<PageIntro eyebrow={page.intro.eyebrow} title={page.intro.title} lead={page.intro.lead} />
			<Section spacing="none" className="pb-section">
				<Container>
					{posts.length === 0 ? (
						<Text size="body-lg" tone="muted" className="border-t border-rule pt-8">
							No posts yet.
						</Text>
					) : (
						<ul className="m-0 list-none border-b border-rule p-0">
							{posts.map((post) => (
								<li key={post.slug}>
									<PostListItem post={post} />
								</li>
							))}
						</ul>
					)}
				</Container>
			</Section>
		</>
	);
}
