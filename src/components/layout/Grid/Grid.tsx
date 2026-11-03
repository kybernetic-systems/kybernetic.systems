import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const grid = tv({
	base: "m-0 grid list-none p-0",
	variants: {
		cols: {
			2: "gap-12 md:grid-cols-2 lg:gap-16",
			// Three items in two columns leave an orphan, so three-up grids go straight from one to three.
			3: "gap-10 lg:grid-cols-3 lg:gap-12",
		},
	},
	defaultVariants: { cols: 3 },
});

export type GridProps = VariantProps<typeof grid> & {
	/** Grids of like items are lists. */
	as?: "ul" | "ol" | "div";
	className?: string | undefined;
	children: ReactNode;
};

export function Grid({ as: Tag = "ul", cols, className, children }: GridProps) {
	return <Tag className={grid({ cols, className })}>{children}</Tag>;
}
