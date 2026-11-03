import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Split } from "#/components/layout/Split/Split";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import type { Hast } from "#/content/api";

export type NameOriginProps = {
	id: string;
	eyebrow: string;
	/** The Greek word, marked up as Greek for pronunciation. */
	word: string;
	transliteration: string;
	body: Hast;
};

/** Where the company name comes from. */
export function NameOrigin({ id, eyebrow, word, transliteration, body }: NameOriginProps) {
	return (
		<Section spacing="lg" divider labelledBy={id}>
			<Container>
				<Split
					aside={
						<>
							<Eyebrow as="h2" id={id} className="mb-4.5">
								{eyebrow}
							</Eyebrow>
							<p lang="el" className="m-0 font-serif text-heading-xl text-fg italic">
								{word}
							</p>
							<p className="mt-3 mb-0 font-mono text-mono-sm tracking-meta text-fg-muted">
								{transliteration}
							</p>
						</>
					}
				>
					<Prose content={body} className="max-w-measure-lg" />
				</Split>
			</Container>
		</Section>
	);
}
