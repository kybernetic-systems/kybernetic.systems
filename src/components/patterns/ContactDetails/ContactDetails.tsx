import type { ReactNode } from "react";

import { CopyAddressButton } from "#/components/patterns/CopyAddressButton/CopyAddressButton";
import { Link } from "#/components/primitives/Link/Link";
import type { ContactPage, Site } from "#/content/api";

export type ContactDetailsProps = {
	site: Pick<Site, "email" | "phone" | "registeredOffice">;
	labels: ContactPage["details"];
};

function Detail({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div>
			<dt className="mb-2.5 font-mono text-mono-xs tracking-label text-accent uppercase">
				{label}
			</dt>
			<dd className="m-0">{children}</dd>
		</div>
	);
}

/** Email, telephone, registered office and grievance contact. */
export function ContactDetails({ site, labels }: ContactDetailsProps) {
	return (
		<dl className="m-0 grid gap-8.5">
			<Detail label={labels.emailLabel}>
				<Link
					href={`mailto:${site.email}`}
					variant="underline"
					className="font-serif text-heading-md text-fg"
				>
					{site.email}
				</Link>
				<CopyAddressButton address={site.email} className="mt-1 flex" />
			</Detail>
			<Detail label={labels.phoneLabel}>
				<Link
					href={`tel:${site.phone.e164}`}
					variant="underline"
					className="font-serif text-heading-md text-fg"
				>
					{site.phone.display}
				</Link>
			</Detail>
			<Detail label={labels.officeLabel}>
				<address className="font-serif text-body-lg text-fg-body not-italic">
					{site.registeredOffice.lines.map((line) => (
						<span key={line} className="block">
							{line}
						</span>
					))}
				</address>
			</Detail>
			<Detail label={labels.grievancesLabel}>
				<p className="m-0 font-serif text-body-lg text-fg-body">{labels.grievancesBody}</p>
			</Detail>
		</dl>
	);
}
