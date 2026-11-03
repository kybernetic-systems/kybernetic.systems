import { useId } from "react";

import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { CopyAddressButton } from "#/components/patterns/CopyAddressButton/CopyAddressButton";
import { ButtonLink } from "#/components/primitives/ButtonLink/ButtonLink";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Link } from "#/components/primitives/Link/Link";
import { Text } from "#/components/primitives/Text/Text";
import { VisuallyHidden } from "#/components/primitives/VisuallyHidden/VisuallyHidden";
import type { Hast } from "#/content/api";
import { mailto } from "#/lib/mailto";

export type NotifyCtaProps = {
	title: string;
	body: string;
	ctaLabel: string;
	privacyNote: Hast;
	email: string;
	subject: string;
	emailBody: string;
};

/** Asks to be told about the launch by email. There's no form: the email is the sign-up. */
export function NotifyCta({
	title,
	body,
	ctaLabel,
	privacyNote,
	email,
	subject,
	emailBody,
}: NotifyCtaProps) {
	const headingId = useId();
	return (
		<Section tone="ink" spacing="md" labelledBy={headingId}>
			<Container size="narrow" className="text-center">
				<Heading level={2} size="heading-xl" id={headingId} className="mb-4.5">
					{title}
				</Heading>
				<Text size="body-lg" tone="muted" className="mb-10">
					{body}
				</Text>
				<ButtonLink href={mailto({ to: email, subject, body: emailBody })} intent="brass" block>
					{ctaLabel}
					<VisuallyHidden> (opens your email app)</VisuallyHidden>
				</ButtonLink>
				<p className="mt-5 mb-0 font-serif text-body-sm text-fg-muted">
					Or write to{" "}
					<Link href={`mailto:${email}`} variant="underline" className="text-fg">
						{email}
					</Link>
				</p>
				<CopyAddressButton address={email} className="justify-center" />
				<p className="mx-auto mt-6 mb-0 max-w-[36em] font-serif text-body-sm text-fg-subtle">
					<Prose content={privacyNote} inline />
				</p>
			</Container>
		</Section>
	);
}
