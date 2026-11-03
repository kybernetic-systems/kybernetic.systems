import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const container = tv({
	base: "mx-auto w-full px-gutter",
	variants: {
		size: {
			page: "max-w-[calc(var(--container-page)+2*var(--spacing-gutter))]",
			statement: "max-w-[calc(var(--container-statement)+2*var(--spacing-gutter))]",
			article: "max-w-[calc(var(--container-article)+2*var(--spacing-gutter))]",
			narrow: "max-w-[calc(var(--container-narrow)+2*var(--spacing-gutter))]",
		},
	},
	defaultVariants: { size: "page" },
});

export type ContainerProps = VariantProps<typeof container> & {
	className?: string | undefined;
	children: ReactNode;
};

/** Centers content at a design width, with the page gutter on both sides. */
export function Container({ size, className, children }: ContainerProps) {
	return <div className={container({ size, className })}>{children}</div>;
}
