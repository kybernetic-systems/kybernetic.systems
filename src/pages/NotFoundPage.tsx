import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { ArrowLink } from "#/components/primitives/ArrowLink/ArrowLink";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Text } from "#/components/primitives/Text/Text";

/** Shown for any address that doesn't match a page. */
export function NotFoundPage() {
	return (
		<Section spacing="lg">
			<Container>
				<Eyebrow className="mb-8">Error 404</Eyebrow>
				<Heading level={1} size="display" className="mb-8 max-w-[14em]">
					This page drifted off course.
				</Heading>
				<Text size="lead" tone="muted" measure="md" className="mb-12">
					The address may be mistyped, or the page may have moved. The helm is this way.
				</Text>
				<ArrowLink href="/">Back to the home page</ArrowLink>
			</Container>
		</Section>
	);
}
