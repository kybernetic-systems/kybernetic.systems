import Mark from "#/components/primitives/Logo/mark.svg?react";
import { cn } from "#/lib/tv";

export type LogoProps = {
	/** Hide the mark from assistive technology when text next to it already names the company. */
	decorative?: boolean;
	/** Accessible name when the mark stands alone. */
	label?: string;
	/** Slowly rotate the mark, unless the viewer prefers reduced motion. */
	spin?: boolean;
	className?: string | undefined;
};

/**
 * The helm-and-ouroboros mark. Size it with width and height classes.
 *
 * `mark.svg` in this folder is the only copy of the artwork: this component imports it, the favicon
 * links to it (see `src/routes/__root.tsx`) and `scripts/og.ts` inlines it into the social card. The
 * file paints in `currentColor` and defaults to brass, so it looks right on its own and follows the
 * `text-*` class used here.
 */
export function Logo({
	decorative = false,
	label = "Kybernetic Systems",
	spin = false,
	className,
}: LogoProps) {
	const classes = cn("block text-decor", spin && "motion-safe:animate-helm", className);
	return decorative ? (
		<Mark aria-hidden="true" focusable="false" className={classes} />
	) : (
		// An inline SVG can't be an <img>; role="img" is the accessible pattern for a labelled SVG.
		// oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
		<Mark role="img" aria-label={label} className={classes} />
	);
}
