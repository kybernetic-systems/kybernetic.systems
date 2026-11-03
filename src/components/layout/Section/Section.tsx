import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const section = tv({
	base: "bg-surface text-fg",
	variants: {
		spacing: {
			none: "",
			sm: "py-section-sm",
			md: "py-section",
			lg: "py-section-lg",
			top: "pt-section",
			bottom: "pb-section",
		},
		divider: { true: "border-b border-rule" },
	},
	defaultVariants: { spacing: "md" },
});

export type SectionProps = VariantProps<typeof section> & {
	/** Ink sections re-theme everything inside them. */
	tone?: "paper" | "ink";
	/** Id of the heading that names this section, so it's listed as a region. */
	labelledBy?: string;
	as?: "section" | "div" | "article";
	className?: string | undefined;
	children: ReactNode;
};

/** A full-width band of the page. Sets the tone and vertical rhythm; content goes in a Container. */
export function Section({
	tone,
	spacing,
	divider,
	labelledBy,
	as: Tag = "section",
	className,
	children,
}: SectionProps) {
	return (
		<Tag
			data-tone={tone}
			aria-labelledby={labelledBy}
			className={section({ spacing, divider, className })}
		>
			{children}
		</Tag>
	);
}
