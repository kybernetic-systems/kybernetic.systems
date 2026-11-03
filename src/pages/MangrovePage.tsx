import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Split } from "#/components/layout/Split/Split";
import { NotifyCta } from "#/components/patterns/NotifyCta/NotifyCta";
import { NumberedList } from "#/components/patterns/NumberedList/NumberedList";
import { PageIntro } from "#/components/patterns/PageIntro/PageIntro";
import { StatementBlock } from "#/components/patterns/StatementBlock/StatementBlock";
import { TeaserBand } from "#/components/patterns/TeaserBand/TeaserBand";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import type { Mangrove, Site } from "#/content/api";

export type MangrovePageProps = {
	page: Mangrove;
	site: Pick<Site, "email" | "mailto">;
};

export function MangrovePage({ page, site }: MangrovePageProps) {
	return (
		<>
			<PageIntro
				eyebrow={page.hero.eyebrow}
				title={page.hero.title}
				lead={page.hero.lead}
				titleWidth="wide"
			/>
			<StatementBlock
				id="premise"
				eyebrow={page.premise.eyebrow}
				statements={page.premise.statements}
			/>
			<Section tone="ink" spacing="md" labelledBy="uses">
				<Container>
					<Split
						aside={
							<Eyebrow as="h2" id="uses">
								{page.uses.eyebrow}
							</Eyebrow>
						}
					>
						<NumberedList items={page.uses.items} layout="stack" numbered={false} />
					</Split>
				</Container>
			</Section>
			<Section spacing="lg" divider labelledBy="how-it-works">
				<Container>
					<Eyebrow as="h2" id="how-it-works" className="mb-12 md:mb-16">
						{page.howItWorks.eyebrow}
					</Eyebrow>
					<NumberedList items={page.howItWorks.items} layout="grid" />
				</Container>
			</Section>
			<Section spacing="none" divider labelledBy="sovereignty" className="py-section">
				<Container>
					<Split
						aside={
							<Eyebrow as="h2" id="sovereignty">
								{page.sovereignty.eyebrow}
							</Eyebrow>
						}
					>
						<Prose content={page.sovereignty.body} className="max-w-measure-lg" />
					</Split>
				</Container>
			</Section>
			<NotifyCta
				title={page.notify.title}
				body={page.notify.body}
				ctaLabel={page.notify.ctaLabel}
				privacyNote={page.notify.privacyNote}
				email={site.email}
				subject={site.mailto.notify.subject}
				emailBody={site.mailto.notify.body}
			/>
			<TeaserBand
				id="company"
				layout="split"
				eyebrow={page.company.eyebrow}
				title={page.company.title}
				body={page.company.body}
				link={{ label: page.company.linkLabel, href: page.company.href }}
			/>
		</>
	);
}
