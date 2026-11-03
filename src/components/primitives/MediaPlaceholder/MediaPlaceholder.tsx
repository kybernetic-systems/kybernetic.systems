import type { VariantProps } from "tailwind-variants";

import { tv } from "#/lib/tv";

const placeholder = tv({
	base: "flex items-end border border-rule-strong bg-hatch p-3.5",
	variants: {
		aspect: {
			"1/1": "aspect-square",
			"4/5": "aspect-4/5",
			"16/10": "aspect-16/10",
		},
	},
	defaultVariants: { aspect: "16/10" },
});

export type MediaPlaceholderProps = VariantProps<typeof placeholder> & {
	caption: string;
	className?: string | undefined;
};

/** Hatched frame standing in for media that doesn't exist yet. Hidden from assistive technology. */
export function MediaPlaceholder({ aspect, caption, className }: MediaPlaceholderProps) {
	return (
		<div aria-hidden="true" className={placeholder({ aspect, className })}>
			<span className="font-mono text-mono-xs tracking-meta text-fg-muted">{caption}</span>
		</div>
	);
}
