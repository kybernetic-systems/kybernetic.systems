import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Split } from "#/components/layout/Split/Split";
import { ArrowLink } from "#/components/primitives/ArrowLink/ArrowLink";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Text } from "#/components/primitives/Text/Text";

export type TeaserBandProps = {
	id: string;
	eyebrow: string;
	/** The large statement. */
	title: string;
	body?: string | undefined;
	link: { label: string; href: string };
	/** `inline` puts the link beside the text; `split` uses the label column on the ink tone. */
	layout?: "inline" | "split";
};

/** A home page band pointing to another page. */
export function TeaserBand({ id, eyebrow, title, body, link, layout = "inline" }: TeaserBandProps) {
	if (layout === "split") {
		return (
			<Section tone="ink" spacing="md" labelledBy={id}>
				<Container>
					<Split
						aside={
							<Eyebrow as="h2" id={id}>
								{eyebrow}
							</Eyebrow>
						}
					>
						<Text size="statement" tone="default" className="mb-5.5 max-w-[22em]">
							{title}
						</Text>
						{body && (
							<Text size="body-lg" tone="muted" className="mb-10 max-w-measure">
								{body}
							</Text>
						)}
						<ArrowLink href={link.href}>{link.label}</ArrowLink>
					</Split>
				</Container>
			</Section>
		);
	}
	return (
		<Section spacing="md" divider labelledBy={id}>
			<Container className="flex flex-wrap items-end justify-between gap-10 md:gap-15">
				<div className="max-w-[34em]">
					<Eyebrow as="h2" id={id} className="mb-6">
						{eyebrow}
					</Eyebrow>
					<Text size="statement" tone="default">
						{title}
					</Text>
					{body && (
						<Text size="body-lg" tone="muted" className="mt-5">
							{body}
						</Text>
					)}
				</div>
				<ArrowLink href={link.href}>{link.label}</ArrowLink>
			</Container>
		</Section>
	);
}
