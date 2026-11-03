import type { ReactNode } from "react";

/** Outlined status label, such as "Opening soon". */
export function Badge({ children }: { children: ReactNode }) {
	return (
		<span className="inline-block border border-decor/60 px-2.5 py-1 font-mono text-mono-xs tracking-label text-accent uppercase">
			{children}
		</span>
	);
}
