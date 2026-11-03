import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const eyebrow = tv({
	base: "m-0 font-mono text-mono-sm uppercase",
	variants: {
		tracking: {
			eyebrow: "tracking-eyebrow",
			label: "tracking-label",
			meta: "tracking-meta",
		},
		tone: {
			accent: "text-accent",
			muted: "text-fg-muted",
		},
	},
	defaultVariants: { tracking: "eyebrow", tone: "accent" },
});

export type EyebrowProps = VariantProps<typeof eyebrow> & {
	/** Render as a heading when the eyebrow is the only heading of its section. */
	as?: "p" | "span" | "h2" | "h3" | "dt";
	id?: string | undefined;
	className?: string | undefined;
	children: ReactNode;
};

/** Mono uppercase label that introduces a section. */
export function Eyebrow({ as: Tag = "p", id, tracking, tone, className, children }: EyebrowProps) {
	return (
		<Tag id={id} className={eyebrow({ tracking, tone, className })}>
			{children}
		</Tag>
	);
}
