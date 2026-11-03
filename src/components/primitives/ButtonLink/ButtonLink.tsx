import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { Link } from "#/components/primitives/Link/Link";
import { tv } from "#/lib/tv";

const buttonLink = tv({
	base: "inline-flex min-h-11 items-center justify-center border px-8 py-3.5 text-center font-serif text-body-lg transition-colors",
	variants: {
		intent: {
			ink: "border-fg bg-fg text-surface hover:border-brass hover:bg-brass hover:text-navy",
			brass:
				"border-brass bg-brass text-navy hover:border-brass-light hover:bg-brass-light hover:text-navy",
		},
		block: {
			true: "w-full sm:w-auto",
		},
	},
	defaultVariants: { intent: "ink" },
});

export type ButtonLinkProps = VariantProps<typeof buttonLink> & {
	href: string;
	className?: string | undefined;
	children: ReactNode;
};

/** A link styled as a solid button. There are no forms yet, so every button is a link. */
export function ButtonLink({ href, intent, block, className, children }: ButtonLinkProps) {
	return (
		<Link
			href={href}
			variant="plain"
			current="none"
			className={buttonLink({ intent, block, className })}
		>
			{children}
		</Link>
	);
}
