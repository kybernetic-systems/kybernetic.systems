import type { ReactNode } from "react";

import { SiteShell } from "#/components/layout/SiteShell/SiteShell";
import { site } from "#/content/fixtures";

/** Wraps a page story in the real header and footer. */
export function PageFrame({ children }: { children: ReactNode }) {
	return (
		<SiteShell site={site} grievanceOfficer="Adit Shah" year={2026}>
			{children}
		</SiteShell>
	);
}
