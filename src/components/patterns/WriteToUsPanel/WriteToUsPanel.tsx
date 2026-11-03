import { useId } from "react";

import { Prose } from "#/components/content/Prose/Prose";
import { ButtonLink } from "#/components/primitives/ButtonLink/ButtonLink";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Text } from "#/components/primitives/Text/Text";
import { VisuallyHidden } from "#/components/primitives/VisuallyHidden/VisuallyHidden";
import type { Hast } from "#/content/api";
import { mailto } from "#/lib/mailto";

export type WriteToUsPanelProps = {
	title: string;
	body: string;
	ctaLabel: string;
	privacyNote: Hast;
	email: string;
	subject?: string | undefined;
};

/** The contact page's call to write, in place of a form. */
export function WriteToUsPanel({
	title,
	body,
	ctaLabel,
	privacyNote,
	email,
	subject,
}: WriteToUsPanelProps) {
	const headingId = useId();
	return (
		<section aria-labelledby={headingId} className="border border-rule-strong p-panel">
			<Heading level={2} size="heading-lg" id={headingId} className="mb-4">
				{title}
			</Heading>
			<Text size="body-lg" tone="muted" className="mb-8">
				{body}
			</Text>
			<ButtonLink href={mailto({ to: email, subject })} block>
				{ctaLabel}
				<VisuallyHidden> (opens your email app)</VisuallyHidden>
			</ButtonLink>
			<p className="mt-7 mb-0 font-serif text-body-sm text-fg-muted">
				<Prose content={privacyNote} inline />
			</p>
		</section>
	);
}
