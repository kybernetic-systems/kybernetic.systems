import type { VariantProps } from "tailwind-variants";

import { Heading } from "#/components/primitives/Heading/Heading";
import { tv } from "#/lib/tv";

const numberedList = tv({
	slots: {
		list: "m-0 list-none p-0",
		item: "border-t",
		number: "m-0 font-mono text-mono-sm tracking-label text-accent",
		title: "",
		body: "m-0 font-serif text-body",
	},
	variants: {
		layout: {
			grid: {
				list: "grid gap-12 lg:grid-cols-3 lg:gap-16",
				item: "border-rule-strong pt-6.5",
				number: "mb-4 md:mb-5",
				title: "mb-4.5",
				body: "text-fg-muted",
			},
			rows: {
				list: "grid gap-9 md:gap-10.5",
				item: "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-rule pt-5.5 md:grid-cols-[3.75rem_minmax(0,1fr)] md:gap-7",
				number: "mt-1.5",
				title: "mb-2.5",
				body: "max-w-measure-lg text-fg-muted",
			},
			stack: {
				list: "grid gap-9 md:gap-11.5",
				item: "border-rule pt-6",
				title: "mb-3",
				body: "max-w-[40em] text-fg-muted",
			},
		},
	},
	defaultVariants: { layout: "grid" },
});

export type NumberedListItem = { title: string; body: string };

export type NumberedListProps = VariantProps<typeof numberedList> & {
	items: NumberedListItem[];
	/** Show "01", "02"… The list is ordered either way when numbered. */
	numbered?: boolean;
	headingLevel?: 3 | 4;
	className?: string | undefined;
};

/**
 * Titled items with a hairline above: principles (grid), hiring steps (numbered rows), values
 * (stack). Numbers are hidden from screen readers, which announce the list position already.
 */
export function NumberedList({
	items,
	layout,
	numbered = true,
	headingLevel = 3,
	className,
}: NumberedListProps) {
	const styles = numberedList({ layout });
	const List = numbered ? "ol" : "ul";
	return (
		<List className={styles.list({ className })}>
			{items.map((item, index) => (
				<li key={item.title} className={styles.item()}>
					{numbered && (
						<p aria-hidden="true" className={styles.number()}>
							{String(index + 1).padStart(2, "0")}
						</p>
					)}
					<div className={layout === "grid" ? undefined : "min-w-0"}>
						<Heading
							level={headingLevel}
							size={layout === "grid" ? "heading-lg" : "heading-md"}
							className={styles.title()}
						>
							{item.title}
						</Heading>
						<p className={styles.body()}>{item.body}</p>
					</div>
				</li>
			))}
		</List>
	);
}
