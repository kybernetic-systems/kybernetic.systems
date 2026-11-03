import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Logo } from "#/components/primitives/Logo/Logo";
import { Rule } from "#/components/primitives/Rule/Rule";
import { Text } from "#/components/primitives/Text/Text";

export type HeroProps = {
	eyebrow: string;
	/** Each entry starts a new line of the title. */
	titleLines: string[];
	lead: string;
	markLabel: string;
	/** Slowly rotate the mark (never under reduced motion). */
	spin?: boolean;
};

/** The home page opening: company name, motto and the mark. */
export function Hero({ eyebrow, titleLines, lead, markLabel, spin = true }: HeroProps) {
	return (
		<Section tone="ink" spacing="lg" className="overflow-hidden">
			<Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
				<div className="motion-safe:animate-rise">
					<Eyebrow className="mb-7 md:mb-8.5">{eyebrow}</Eyebrow>
					<Heading level={1} size="display-xl">
						{titleLines.map((line, index) => (
							<span key={line}>
								{index > 0 && <br />}
								{line}
							</span>
						))}
					</Heading>
					<Rule variant="accent" className="my-8 md:my-10" />
					<Text size="lead" tone="muted" className="max-w-measure-sm">
						{lead}
					</Text>
				</div>
				<div className="flex justify-center motion-safe:animate-fade">
					<Logo label={markLabel} spin={spin} className="w-mark max-w-full" />
				</div>
			</Container>
		</Section>
	);
}
