import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Split } from "#/components/layout/Split/Split";
import { CalloutPanel } from "#/components/patterns/CalloutPanel/CalloutPanel";
import { NumberedList } from "#/components/patterns/NumberedList/NumberedList";
import { PageIntro } from "#/components/patterns/PageIntro/PageIntro";
import { RoleListItem } from "#/components/patterns/RoleListItem/RoleListItem";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Meta } from "#/components/primitives/Meta/Meta";
import { Text } from "#/components/primitives/Text/Text";
import type { CareersPage as CareersPageContent, RoleSummary, Site } from "#/content/api";
import { mailto } from "#/lib/mailto";

export type CareersPageProps = {
	page: CareersPageContent;
	roles: RoleSummary[];
	site: Pick<Site, "email" | "mailto">;
};

export function HiringSteps({ hiring, id }: { hiring: CareersPageContent["hiring"]; id: string }) {
	return (
		<Section tone="ink" spacing="md" labelledBy={id}>
			<Container>
				<Split
					aside={
						<Eyebrow as="h2" id={id}>
							{hiring.eyebrow}
						</Eyebrow>
					}
				>
					<Text size="body-lg" tone="body" className="mb-12 max-w-[36em] md:mb-14">
						{hiring.lead}
					</Text>
					<NumberedList items={hiring.steps} layout="rows" />
				</Split>
			</Container>
		</Section>
	);
}

export function CareersPage({ page, roles, site }: CareersPageProps) {
	return (
		<>
			<PageIntro eyebrow={page.intro.eyebrow} title={page.intro.title} lead={page.intro.lead} />
			<Section spacing="none" labelledBy="roles" className="pb-section">
				<Container>
					<div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-3">
						<Eyebrow as="h2" id="roles">
							{page.roles.eyebrow}
						</Eyebrow>
						<Meta size="sm" tracking="meta" className="normal-case">
							{page.roles.location}
						</Meta>
					</div>
					{roles.length === 0 ? (
						<Text size="body-lg" tone="muted" className="border-t border-rule py-10">
							{page.roles.emptyMessage}
						</Text>
					) : (
						<ul className="m-0 list-none border-b border-rule p-0">
							{roles.map((role) => (
								<li key={role.slug}>
									<RoleListItem role={role} readLabel={page.roles.readLabel} />
								</li>
							))}
						</ul>
					)}
				</Container>
			</Section>
			<Section spacing="none" labelledBy="commitments" className="pb-section">
				<Container>
					<Split
						aside={
							<Eyebrow as="h2" id="commitments">
								{page.commitments.eyebrow}
							</Eyebrow>
						}
					>
						<Prose content={page.commitments.body} className="max-w-measure-lg" />
					</Split>
				</Container>
			</Section>
			<HiringSteps hiring={page.hiring} id="hiring" />
			<Section spacing="md" labelledBy="honesty">
				<Container>
					<Split
						aside={
							<Eyebrow as="h2" id="honesty">
								{page.honesty.eyebrow}
							</Eyebrow>
						}
					>
						<Prose content={page.honesty.body} className="max-w-measure-lg" />
					</Split>
				</Container>
			</Section>
			<Section spacing="none" className="pb-section">
				<Container>
					<CalloutPanel
						title={page.openApplication.title}
						body={page.openApplication.body}
						action={{
							label: page.openApplication.ctaLabel,
							href: mailto({
								to: site.email,
								subject: site.mailto.openApplication.subject,
								body: site.mailto.openApplication.body,
							}),
						}}
					/>
				</Container>
			</Section>
		</>
	);
}
