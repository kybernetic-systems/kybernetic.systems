import type { ReactNode } from "react";

import { ProductShell } from "#/components/layout/ProductShell/ProductShell";
import { site } from "#/content/fixtures";
import { products } from "#/lib/subdomain";

/** Wraps a product page story in the shell its own subdomain serves. */
export function ProductFrame({ children }: { children: ReactNode }) {
	return (
		<ProductShell
			name={products.mangrove.label}
			home="/mangrove"
			company={{ name: site.shortName, legalName: site.legalName }}
			year={2026}
		>
			{children}
		</ProductShell>
	);
}
