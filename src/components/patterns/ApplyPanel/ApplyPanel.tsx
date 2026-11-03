import { useId } from "react";

import { Prose } from "#/components/content/Prose/Prose";
import { CopyAddressButton } from "#/components/patterns/CopyAddressButton/CopyAddressButton";
import { ButtonLink } from "#/components/primitives/ButtonLink/ButtonLink";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Link } from "#/components/primitives/Link/Link";
import { VisuallyHidden } from "#/components/primitives/VisuallyHidden/VisuallyHidden";
import type { Hast } from "#/content/api";
import { mailto } from "#/lib/mailto";

export type ApplyPanelProps = {
	title: string;
	body: Hast;
	ctaLabel: string;
	email: string;
	subject: string;
	emailBody: string;
};

/** How to apply for a role: a pre-filled email, with the address shown for copying. */
export function ApplyPanel({ title, body, ctaLabel, email, subject, emailBody }: ApplyPanelProps) {
	const headingId = useId();
	return (
		<aside aria-labelledby={headingId} className="@container border border-rule-strong p-panel">
			<Heading level={2} size="heading-md" id={headingId} className="mb-4">
				{title}
			</Heading>
			<Prose content={body} size="body" tone="muted" className="mb-7" />
			<ButtonLink href={mailto({ to: email, subject, body: emailBody })} className="w-full">
				{ctaLabel}
				<VisuallyHidden> (opens your email app)</VisuallyHidden>
			</ButtonLink>
			<p className="mt-5 mb-0 font-serif text-body-sm text-fg-muted">
				Or write to{" "}
				<Link href={`mailto:${email}`} variant="underline" className="text-fg">
					{email}
				</Link>
			</p>
			<CopyAddressButton address={email} />
		</aside>
	);
}
