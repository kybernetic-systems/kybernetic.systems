import type { ReactNode } from "react";

import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Text } from "#/components/primitives/Text/Text";
import { cn } from "#/lib/tv";

export type PageIntroProps = {
	eyebrow: string;
	title: string;
	lead?: string | undefined;
	/** Width of the title, in em, before it wraps. */
	titleWidth?: "narrow" | "wide";
	children?: ReactNode;
};

/** The opening of an inner page: eyebrow, large title and an optional lead paragraph. */
export function PageIntro({
	eyebrow,
	title,
	lead,
	titleWidth = "narrow",
	children,
}: PageIntroProps) {
	return (
		<Section spacing="none" className="pt-section pb-section-sm">
			<Container>
				<Eyebrow className="mb-6 md:mb-8">{eyebrow}</Eyebrow>
				<Heading
					level={1}
					size="display"
					className={cn(
						titleWidth === "wide" ? "max-w-[16em]" : "max-w-[15em]",
						lead && "mb-7 md:mb-8.5",
					)}
				>
					{title}
				</Heading>
				{lead && (
					<Text size="lead" tone="muted" className="max-w-[36em]">
						{lead}
					</Text>
				)}
				{children}
			</Container>
		</Section>
	);
}
