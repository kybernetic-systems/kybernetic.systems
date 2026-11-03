import { useId } from "react";

import { ButtonLink } from "#/components/primitives/ButtonLink/ButtonLink";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Text } from "#/components/primitives/Text/Text";
import { VisuallyHidden } from "#/components/primitives/VisuallyHidden/VisuallyHidden";

export type CalloutPanelProps = {
	title: string;
	body: string;
	action: { label: string; href: string };
	headingLevel?: 2 | 3;
};

/** A bordered prompt with one call to action. Lays itself out by its own width. */
export function CalloutPanel({ title, body, action, headingLevel = 2 }: CalloutPanelProps) {
	const headingId = useId();
	const isEmail = action.href.startsWith("mailto:");
	return (
		<section aria-labelledby={headingId} className="@container">
			<div className="flex flex-col gap-8 border border-rule-strong p-panel-lg @2xl:flex-row @2xl:flex-wrap @2xl:items-center @2xl:justify-between @2xl:gap-14">
				<div className="max-w-[32em]">
					<Heading level={headingLevel} size="heading-xl" id={headingId} className="mb-3.5">
						{title}
					</Heading>
					<Text size="body-lg" tone="muted">
						{body}
					</Text>
				</div>
				<ButtonLink href={action.href} className="w-full @2xl:w-auto">
					{action.label}
					{isEmail && <VisuallyHidden> (opens your email app)</VisuallyHidden>}
				</ButtonLink>
			</div>
		</section>
	);
}
