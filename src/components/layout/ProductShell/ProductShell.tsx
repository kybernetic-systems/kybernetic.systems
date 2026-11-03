import type { ReactNode } from "react";

import { Container } from "#/components/layout/Container/Container";
import { RouteAnnouncer } from "#/components/layout/RouteAnnouncer/RouteAnnouncer";
import { SkipLink } from "#/components/layout/SkipLink/SkipLink";
import { Link } from "#/components/primitives/Link/Link";
import { Logo } from "#/components/primitives/Logo/Logo";

export type ProductShellProps = {
	/** The product's name, set as its wordmark. */
	name: string;
	/** Path of the product's own home, e.g. `/mangrove`. */
	home: string;
	/** The company, whose pages are site paths; Link resolves them to the company's own host. */
	company: { name: string; legalName: string };
	year: number;
	children: ReactNode;
};

/**
 * The frame for a product served on its own subdomain. The company's navigation does not belong
 * here — those pages are on another host — so the links out are few. They are written as ordinary
 * site paths and resolved to the company's host by `Link`.
 */
export function ProductShell({ name, home, company, year, children }: ProductShellProps) {
	return (
		<div className="flex min-h-dvh flex-col">
			<SkipLink />
			<header className="sticky top-0 z-50 border-b border-rule bg-frosted">
				<Container className="flex h-header items-center justify-between gap-8">
					<Link
						href={home}
						variant="plain"
						current="none"
						className="flex items-center gap-3.5 py-2"
					>
						<Logo decorative className="size-8 lg:size-[34px]" />
						<span className="font-mono text-mono-sm tracking-label text-fg uppercase">{name}</span>
					</Link>
					<Link href="/" variant="nav" className="font-serif text-body-lg">
						{company.name}
					</Link>
				</Container>
			</header>
			<main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
				{children}
			</main>
			<footer data-tone="ink" className="bg-surface pt-section-sm pb-11 text-fg-muted">
				<Container className="flex flex-col gap-3 border-t border-rule pt-7 md:flex-row md:flex-wrap md:justify-between md:gap-8">
					<p className="m-0 font-mono text-mono-xs tracking-meta text-fg-subtle">
						© {year} {company.legalName}. {name} is a product of {company.name}.
					</p>
					<ul className="m-0 flex list-none flex-wrap gap-6 p-0">
						<li>
							<Link
								href="/privacy"
								variant="footer"
								className="font-mono text-mono-xs tracking-meta"
							>
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link href="/terms" variant="footer" className="font-mono text-mono-xs tracking-meta">
								Terms of Use
							</Link>
						</li>
					</ul>
				</Container>
			</footer>
			<RouteAnnouncer />
		</div>
	);
}
