import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const text = tv({
	base: "m-0 font-serif",
	variants: {
		size: {
			"statement": "text-statement",
			"lead": "text-lead",
			"body-lg": "text-body-lg",
			"body": "text-body",
			"body-sm": "text-body-sm",
		},
		tone: {
			default: "text-fg",
			body: "text-fg-body",
			muted: "text-fg-muted",
			subtle: "text-fg-subtle",
		},
		measure: {
			none: "",
			sm: "max-w-measure-sm",
			md: "max-w-measure",
			lg: "max-w-measure-lg",
		},
		italic: { true: "italic" },
	},
	defaultVariants: { size: "body", tone: "body", measure: "none" },
});

export type TextProps = VariantProps<typeof text> & {
	as?: "p" | "span" | "div";
	id?: string | undefined;
	className?: string | undefined;
	children: ReactNode;
};

/** Running serif text. */
export function Text({
	as: Tag = "p",
	size,
	tone,
	measure,
	italic,
	id,
	className,
	children,
}: TextProps) {
	return (
		<Tag id={id} className={text({ size, tone, measure, italic, className })}>
			{children}
		</Tag>
	);
}
