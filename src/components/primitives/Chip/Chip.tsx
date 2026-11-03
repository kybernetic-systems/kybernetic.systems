import type { ReactNode } from "react";

/** Filled tag, such as "Full-time". */
export function Chip({ children }: { children: ReactNode }) {
	return (
		<span className="inline-block bg-tint px-3 py-1.5 font-mono text-mono-xs tracking-meta text-fg-muted uppercase">
			{children}
		</span>
	);
}
