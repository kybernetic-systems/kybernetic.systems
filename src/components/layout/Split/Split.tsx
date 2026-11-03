import type { ReactNode } from "react";

import { cn } from "#/lib/tv";

export type SplitProps = {
	/** The label column: usually an eyebrow. Stacks above the content below the lg breakpoint. */
	aside: ReactNode;
	className?: string | undefined;
	children: ReactNode;
};

/** The design's 300px label column beside content. */
export function Split({ aside, className, children }: SplitProps) {
	return (
		<div
			className={cn(
				"grid gap-6 lg:grid-cols-[var(--spacing-aside)_minmax(0,1fr)] lg:gap-split-gap",
				className,
			)}
		>
			<div>{aside}</div>
			<div className="min-w-0">{children}</div>
		</div>
	);
}
