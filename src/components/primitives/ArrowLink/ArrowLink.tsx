import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { Link } from "#/components/primitives/Link/Link";
import { tv } from "#/lib/tv";

const arrowLink = tv({
	slots: {
		root: "group inline-flex items-baseline gap-3",
		arrow: "text-decor transition-transform",
	},
	variants: {
		appearance: {
			cta: {
				root: "border-b border-decor pb-2 font-serif text-body-lg text-fg hover:text-accent",
			},
			text: { root: "font-serif text-body text-accent hover:text-fg" },
			label: {
				root: "font-mono text-mono-sm tracking-label text-accent uppercase hover:text-fg",
			},
		},
		direction: {
			forward: { arrow: "motion-safe:group-hover:translate-x-1" },
			back: { arrow: "motion-safe:group-hover:-translate-x-1" },
		},
	},
	defaultVariants: { appearance: "cta", direction: "forward" },
});

export type ArrowLinkProps = VariantProps<typeof arrowLink> & {
	href: string;
	className?: string | undefined;
	/** Must make sense on its own; the arrow is decorative. */
	children: ReactNode;
};

/** A link with a decorative arrow: "See Mangrove →" or "← All posts". */
export function ArrowLink({ href, appearance, direction, className, children }: ArrowLinkProps) {
	const { root, arrow } = arrowLink({ appearance, direction });
	const glyph = (
		<span aria-hidden="true" className={arrow()}>
			{direction === "back" ? "←" : "→"}
		</span>
	);
	return (
		<Link href={href} variant="plain" current="none" className={root({ className })}>
			{direction === "back" && glyph}
			<span>{children}</span>
			{direction !== "back" && glyph}
		</Link>
	);
}
