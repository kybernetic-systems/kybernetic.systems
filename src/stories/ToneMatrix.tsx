import type { ReactNode } from "react";

import { cn } from "#/lib/tv";

/** Renders the same content on the paper and ink tones, side by side. */
export function ToneMatrix({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className="grid gap-px bg-rule md:grid-cols-2">
			<div data-tone="paper" className={cn("grid content-start gap-6 p-8", className)}>
				{children}
			</div>
			<div data-tone="ink" className={cn("grid content-start gap-6 p-8", className)}>
				{children}
			</div>
		</div>
	);
}
