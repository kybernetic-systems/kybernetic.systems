import type { ReactNode } from "react";

import { RouteAnnouncer } from "#/components/layout/RouteAnnouncer/RouteAnnouncer";
import { SiteFooter } from "#/components/layout/SiteFooter/SiteFooter";
import { SiteHeader } from "#/components/layout/SiteHeader/SiteHeader";
import { SkipLink } from "#/components/layout/SkipLink/SkipLink";
import type { Site } from "#/content/api";

export type SiteShellProps = {
	site: Site;
	grievanceOfficer: string;
	year: number;
	children: ReactNode;
};

/** Skip link, header, main landmark and footer around every page. */
export function SiteShell({ site, grievanceOfficer, year, children }: SiteShellProps) {
	return (
		<div className="flex min-h-dvh flex-col">
			<SkipLink />
			<SiteHeader nav={site.nav} />
			<main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
				{children}
			</main>
			<SiteFooter site={site} grievanceOfficer={grievanceOfficer} year={year} />
			<RouteAnnouncer />
		</div>
	);
}
