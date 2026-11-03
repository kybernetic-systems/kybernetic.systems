import type { ReactNode } from "react";

import { Container } from "#/components/layout/Container/Container";
import { Link } from "#/components/primitives/Link/Link";
import { Logo } from "#/components/primitives/Logo/Logo";
import type { Site } from "#/content/api";

export type SiteFooterProps = {
	site: Site;
	/** Name of the person handling queries and grievances. */
	grievanceOfficer: string;
	year: number;
};

/** Term and value share a line: flex offers no break point between them. */
const row = "flex items-baseline gap-x-[0.3em]";
const value = "m-0 min-w-0 [overflow-wrap:anywhere]";

function FooterHeading({ children }: { children: ReactNode }) {
	return (
		<h2 className="m-0 mb-4 font-mono text-mono-xs tracking-label text-accent uppercase">
			{children}
		</h2>
	);
}

/** Company disclosures required on the website (Companies Act 2013, s. 12 with Rule 26). */
export function SiteFooter({ site, grievanceOfficer, year }: SiteFooterProps) {
	return (
		<footer data-tone="ink" className="bg-surface pt-section-sm pb-11 text-fg-muted">
			<Container>
				<div className="grid gap-12 border-b border-rule pb-14 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1.3fr_0.7fr] xl:gap-14">
					<div>
						<p className="m-0 mb-5 flex items-center gap-3.5">
							<Logo decorative className="size-10" />
							<span className="font-mono text-mono-sm leading-snug tracking-label text-fg uppercase">
								{site.shortName}
								<br />
								Private Limited
							</span>
						</p>
						<p className="m-0 max-w-measure-sm font-serif text-body">{site.motto}</p>
					</div>

					<div>
						<FooterHeading>Registered office</FooterHeading>
						<address className="font-serif text-body-sm not-italic">
							{site.registeredOffice.lines.map((line, index) => (
								<span key={line} className="block">
									{line}
									{index < site.registeredOffice.lines.length - 1 && ","}
								</span>
							))}
						</address>
					</div>

					<div>
						<FooterHeading>Statutory</FooterHeading>
						<dl className="m-0 grid gap-1 font-serif text-body-sm">
							<div className={row}>
								<dt className="shrink-0">CIN:</dt>
								<dd className={value}>{site.cin}</dd>
							</div>
							<div className={`${row} mt-3`}>
								<dt className="shrink-0">Tel:</dt>
								<dd className={value}>
									<Link href={`tel:${site.phone.e164}`} variant="underline">
										{site.phone.display}
									</Link>
								</dd>
							</div>
							<div className={row}>
								<dt className="shrink-0">Email:</dt>
								<dd className={value}>
									<Link href={`mailto:${site.email}`} variant="underline">
										{site.email}
									</Link>
								</dd>
							</div>
							<div className="mt-3">
								<dt className="inline">Contact for queries &amp; grievances: </dt>
								<dd className="m-0 inline">{grievanceOfficer}</dd>
							</div>
						</dl>
					</div>

					<nav aria-labelledby="footer-site-heading">
						<h2
							id="footer-site-heading"
							className="m-0 mb-4 font-mono text-mono-xs tracking-label text-accent uppercase"
						>
							Site
						</h2>
						<ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-2.5 p-0 md:grid-cols-1">
							{site.footerLinks.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										variant="footer"
										className="inline-block py-0.5 font-serif text-body"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="flex flex-col gap-3 pt-7 md:flex-row md:flex-wrap md:justify-between md:gap-8">
					<p className="m-0 font-mono text-mono-xs tracking-meta text-fg-subtle">
						© {year} {site.legalName}. Incorporated in {site.incorporation.country}.
					</p>
					<p className="m-0 font-mono text-mono-xs tracking-meta text-fg-subtle">
						{site.statutoryNote}
					</p>
				</div>
			</Container>
		</footer>
	);
}
