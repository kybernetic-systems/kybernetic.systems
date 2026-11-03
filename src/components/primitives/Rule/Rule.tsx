import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const rule = tv({
	base: "m-0 block border-0",
	variants: {
		variant: {
			hairline: "h-px w-full bg-rule",
			strong: "h-px w-full bg-rule-strong",
			accent: "h-px w-18 bg-decor",
		},
	},
	defaultVariants: { variant: "hairline" },
});

export type RuleProps = VariantProps<typeof rule> & {
	/**
	 * A separator between pieces of content renders as `<hr>`. Leave this off for purely visual
	 * lines, which are hidden from assistive technology.
	 */
	separator?: boolean;
	className?: string | undefined;
};

/** A horizontal line: full-width hairline, stronger hairline, or the short brass accent. */
export function Rule({ variant, separator = false, className }: RuleProps) {
	const classes = rule({ variant, className });
	return separator ? <hr className={classes} /> : <span aria-hidden="true" className={classes} />;
}
