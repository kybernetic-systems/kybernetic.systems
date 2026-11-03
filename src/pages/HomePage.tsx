import { Container } from "#/components/layout/Container/Container";
import { Grid } from "#/components/layout/Grid/Grid";
import { Section } from "#/components/layout/Section/Section";
import { Hero } from "#/components/patterns/Hero/Hero";
import { NameOrigin } from "#/components/patterns/NameOrigin/NameOrigin";
import { NumberedList } from "#/components/patterns/NumberedList/NumberedList";
import { PostCard } from "#/components/patterns/PostCard/PostCard";
import { StatementBlock } from "#/components/patterns/StatementBlock/StatementBlock";
import { TeaserBand } from "#/components/patterns/TeaserBand/TeaserBand";
import { ArrowLink } from "#/components/primitives/ArrowLink/ArrowLink";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import type { Home, PostSummary } from "#/content/api";

export type HomePageProps = {
	page: Home;
	posts: PostSummary[];
};

export function HomePage({ page, posts }: HomePageProps) {
	return (
		<>
			<Hero
				eyebrow={page.hero.eyebrow}
				titleLines={page.hero.titleLines}
				lead={page.hero.lead}
				markLabel={page.hero.markLabel}
			/>
			<StatementBlock id="cause" eyebrow={page.cause.eyebrow} statements={page.cause.statements} />
			<NameOrigin
				id="name"
				eyebrow={page.name.eyebrow}
				word={page.name.word}
				transliteration={page.name.transliteration}
				body={page.name.body}
			/>
			<Section spacing="lg" divider labelledBy="principles">
				<Container>
					<Eyebrow as="h2" id="principles" className="mb-12 md:mb-16">
						{page.principles.eyebrow}
					</Eyebrow>
					<NumberedList items={page.principles.items} layout="grid" />
				</Container>
			</Section>
			<TeaserBand
				id="products-teaser"
				eyebrow={page.productsTeaser.eyebrow}
				title={page.productsTeaser.title}
				body={page.productsTeaser.body}
				link={{ label: page.productsTeaser.linkLabel, href: page.productsTeaser.href }}
			/>
			<TeaserBand
				id="careers-teaser"
				layout="split"
				eyebrow={page.careersTeaser.eyebrow}
				title={page.careersTeaser.title}
				body={page.careersTeaser.body}
				link={{ label: page.careersTeaser.linkLabel, href: page.careersTeaser.href }}
			/>
			{/* Nothing to tease until something is published, so the section stays away entirely. */}
			{posts.length > 0 && (
				<Section spacing="md" labelledBy="blog">
					<Container>
						<div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 md:mb-14">
							<Eyebrow as="h2" id="blog">
								{page.blogTeaser.eyebrow}
							</Eyebrow>
							<ArrowLink href={page.blogTeaser.href} appearance="text">
								{page.blogTeaser.linkLabel}
							</ArrowLink>
						</div>
						<Grid>
							{posts.map((post) => (
								<li key={post.slug}>
									<PostCard post={post} />
								</li>
							))}
						</Grid>
					</Container>
				</Section>
			)}
		</>
	);
}
