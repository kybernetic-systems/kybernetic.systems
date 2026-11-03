import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const heading = tv({
	base: "m-0 font-serif font-normal text-fg",
	variants: {
		size: {
			"display-xl": "text-display-xl",
			"display": "text-display",
			"statement": "text-statement",
			"heading-xl": "text-heading-xl",
			"heading-lg": "text-heading-lg",
			"heading-md": "text-heading-md",
		},
		italic: { true: "italic" },
	},
	defaultVariants: { size: "heading-lg" },
});

export type HeadingProps = VariantProps<typeof heading> & {
	/** The document outline level. Visual size is set separately with `size`. */
	level: 1 | 2 | 3 | 4;
	id?: string | undefined;
	className?: string | undefined;
	children: ReactNode;
};

/** Serif heading. `level` sets the semantics and `size` the look, so the outline never skips. */
export function Heading({ level, size, italic, id, className, children }: HeadingProps) {
	const Tag = `h${level}` as const;
	return (
		<Tag id={id} className={heading({ size, italic, className })}>
			{children}
		</Tag>
	);
}
