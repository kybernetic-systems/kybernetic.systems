import { Prose } from "#/components/content/Prose/Prose";
import { TableOfContents } from "#/components/content/TableOfContents/TableOfContents";
import { Container } from "#/components/layout/Container/Container";
import { ContentStatusBadge } from "#/components/primitives/ContentStatusBadge/ContentStatusBadge";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Meta } from "#/components/primitives/Meta/Meta";
import { Text } from "#/components/primitives/Text/Text";
import { Time } from "#/components/primitives/Time/Time";
import type { Legal } from "#/content/api";
import { cn } from "#/lib/tv";

export type LegalDocumentProps = {
	document: Pick<
		Legal,
		"title" | "version" | "lastUpdated" | "summaryNote" | "showToc" | "review" | "sections"
	>;
};

/** A versioned legal document with numbered sections. */
export function LegalDocument({ document }: LegalDocumentProps) {
	const sections = (
		<div className="max-w-[44em] min-w-0">
			{document.sections.map((section) => (
				<section
					key={section.id}
					aria-labelledby={section.id}
					className="mb-12 border-t border-rule pt-6.5"
				>
					<p className="m-0 mb-3 font-mono text-mono-xs tracking-label text-accent">
						{section.number}
					</p>
					<Heading level={2} size="heading-lg" id={section.id} className="mb-4.5">
						{section.title}
					</Heading>
					<Prose content={section.body} size="body" headingLevel={3} />
				</section>
			))}
		</div>
	);

	return (
		<article className="pt-section pb-section">
			<Container>
				<header className="mb-12 md:mb-16">
					<Eyebrow className="mb-6 md:mb-8">Legal</Eyebrow>
					<Heading level={1} size="display" className="mb-5">
						{document.title}
					</Heading>
					<Meta size="sm">
						Last updated <Time date={document.lastUpdated} format="long" /> · Version{" "}
						{document.version}
					</Meta>
					{document.summaryNote && (
						<Text tone="muted" className="mt-7 max-w-[46em] border-l-2 border-decor pl-5">
							{document.summaryNote}
						</Text>
					)}
					{document.review.status === "pending-counsel" && (
						<ContentStatusBadge label="Pending counsel review" className="mt-6" />
					)}
				</header>
				<div
					className={cn(
						document.showToc && "grid gap-10 lg:grid-cols-[16.25rem_minmax(0,1fr)] lg:gap-20",
					)}
				>
					{document.showToc && (
						<TableOfContents
							sticky
							label="Contents"
							items={document.sections}
							className="self-start"
						/>
					)}
					{sections}
				</div>
			</Container>
		</article>
	);
}
