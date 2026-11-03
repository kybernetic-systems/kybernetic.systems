import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import type { Hast } from "#/content/api";

export type StatementBlockProps = {
	id: string;
	eyebrow: string;
	/** Single lines of Markdown; emphasis is set in brass italics. */
	statements: Hast[];
};

/** Large statements of purpose on the ink tone, following the hero. */
export function StatementBlock({ id, eyebrow, statements }: StatementBlockProps) {
	return (
		<Section tone="ink" spacing="none" labelledBy={id} className="pb-section-lg">
			<Container size="statement">
				<div className="border-t border-rule-strong pt-16 md:pt-21">
					<Eyebrow as="h2" id={id} className="mb-10 md:mb-14">
						{eyebrow}
					</Eyebrow>
					{statements.map((statement) => (
						<p
							key={JSON.stringify(statement)}
							className="m-0 font-serif text-statement text-fg [&:not(:last-child)]:mb-9 md:[&:not(:last-child)]:mb-11"
						>
							<Prose content={statement} inline emphasis="accent" />
						</p>
					))}
				</div>
			</Container>
		</Section>
	);
}
