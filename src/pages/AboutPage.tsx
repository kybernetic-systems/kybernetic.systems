import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Split } from "#/components/layout/Split/Split";
import { NumberedList } from "#/components/patterns/NumberedList/NumberedList";
import { PageIntro } from "#/components/patterns/PageIntro/PageIntro";
import { ProfileCard } from "#/components/patterns/ProfileCard/ProfileCard";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import type { About, PersonWithPicture } from "#/content/api";

export type AboutPageProps = {
	page: About;
	people: PersonWithPicture[];
};

export function AboutPage({ page, people }: AboutPageProps) {
	return (
		<>
			<PageIntro eyebrow={page.intro.eyebrow} title={page.intro.title} titleWidth="wide" />
			<Section spacing="none" labelledBy="thinking" className="pb-section">
				<Container>
					<div className="border-t border-rule pt-12 md:pt-17.5">
						<Split
							aside={
								<Eyebrow as="h2" id="thinking">
									{page.thinking.eyebrow}
								</Eyebrow>
							}
						>
							<Prose content={page.thinking.body} className="max-w-measure-lg" />
						</Split>
					</div>
				</Container>
			</Section>
			<Section tone="ink" spacing="md" labelledBy="values">
				<Container>
					<Split
						aside={
							<Eyebrow as="h2" id="values">
								{page.values.eyebrow}
							</Eyebrow>
						}
					>
						<NumberedList items={page.values.items} layout="stack" numbered={false} />
					</Split>
				</Container>
			</Section>
			<Section spacing="md" labelledBy="team">
				<Container>
					<Split
						aside={
							<Eyebrow as="h2" id="team">
								{page.team.eyebrow}
							</Eyebrow>
						}
					>
						<div className="grid gap-16">
							{people.map((person) => (
								<ProfileCard key={person.slug} person={person} />
							))}
						</div>
					</Split>
				</Container>
			</Section>
		</>
	);
}
