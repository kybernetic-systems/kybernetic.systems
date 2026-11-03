import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const meta = tv({
	base: "m-0 font-mono uppercase",
	variants: {
		size: {
			xs: "text-mono-xs",
			sm: "text-mono-sm",
		},
		tracking: {
			meta: "tracking-meta",
			label: "tracking-label",
		},
		tone: {
			muted: "text-fg-muted",
			accent: "text-accent",
		},
	},
	defaultVariants: { size: "xs", tracking: "label", tone: "muted" },
});

export type MetaProps = VariantProps<typeof meta> & {
	as?: "p" | "span" | "div";
	className?: string | undefined;
	children: ReactNode;
};

/** Small mono metadata, such as "Jul 12, 2026 · Complexity · 6 min read". */
export function Meta({ as: Tag = "p", size, tracking, tone, className, children }: MetaProps) {
	return <Tag className={meta({ size, tracking, tone, className })}>{children}</Tag>;
}
