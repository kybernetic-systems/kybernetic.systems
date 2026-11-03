import { cnMerge, createTV } from "tailwind-variants";
import type { ClassValue, TWMergeConfig } from "tailwind-variants";

/**
 * Teaches tailwind-merge the project's theme tokens. Without it, `text-display` (a size) and
 * `text-fg` (a color) look like the same kind of class and one of them is dropped.
 */
const twMergeConfig: TWMergeConfig = {
	extend: {
		theme: {
			color: [
				"navy",
				"paper",
				"brass",
				"brass-deep",
				"brass-light",
				"slate",
				"stone",
				"surface",
				"fg",
				"fg-body",
				"fg-muted",
				"fg-subtle",
				"accent",
				"decor",
				"rule",
				"rule-strong",
				"focus",
				"tint",
			],
			text: [
				"display-xl",
				"display",
				"statement",
				"heading-xl",
				"heading-lg",
				"heading-md",
				"lead",
				"body-lg",
				"body",
				"body-sm",
				"mono-note",
				"mono-sm",
				"mono-xs",
			],
			tracking: ["eyebrow", "wordmark", "label", "meta"],
			container: ["page", "statement", "article", "narrow", "measure-sm", "measure", "measure-lg"],
			spacing: [
				"gutter",
				"section-sm",
				"section",
				"section-lg",
				"split-gap",
				"aside",
				"header",
				"mark",
				"panel",
				"panel-lg",
			],
			animate: ["rise", "fade", "helm"],
		},
	},
};

/** `tv` configured with the project's theme tokens. */
export const tv = createTV({ twMergeConfig });

/** Joins class names, letting later classes override conflicting earlier ones. */
export function cn(...classes: ClassValue[]): string | undefined {
	return cnMerge(...classes)({ twMergeConfig });
}
