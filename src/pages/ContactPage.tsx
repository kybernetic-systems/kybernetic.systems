import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { ContactDetails } from "#/components/patterns/ContactDetails/ContactDetails";
import { WriteToUsPanel } from "#/components/patterns/WriteToUsPanel/WriteToUsPanel";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Heading } from "#/components/primitives/Heading/Heading";
import type { ContactPage as ContactPageContent, Site } from "#/content/api";

export type ContactPageProps = {
	page: ContactPageContent;
	site: Pick<Site, "email" | "phone" | "registeredOffice" | "mailto">;
};

export function ContactPage({ page, site }: ContactPageProps) {
	return (
		<Section spacing="md">
			<Container>
				<Eyebrow className="mb-6 md:mb-8">{page.intro.eyebrow}</Eyebrow>
				<Heading level={1} size="display" className="mb-14 max-w-[14em] md:mb-20">
					{page.intro.title}
				</Heading>
				<div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-24">
					<ContactDetails site={site} labels={page.details} />
					<WriteToUsPanel
						title={page.writeToUs.title}
						body={page.writeToUs.body}
						ctaLabel={page.writeToUs.ctaLabel}
						privacyNote={page.writeToUs.privacyNote}
						email={site.email}
						subject={site.mailto.contact.subject}
					/>
				</div>
			</Container>
		</Section>
	);
}
