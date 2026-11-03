import { cn } from "#/lib/tv";

export type TocItem = { id: string; title: string; number?: string };

export type TableOfContentsProps = {
	items: TocItem[];
	label: string;
	/** Sticky sidebar at lg; a collapsed disclosure below it. */
	sticky?: boolean;
	className?: string | undefined;
};

function Items({ items }: { items: TocItem[] }) {
	return (
		<ol className="m-0 grid list-none gap-3 p-0">
			{items.map((item) => (
				<li key={item.id}>
					<a
						href={`#${item.id}`}
						className="block font-mono text-mono-sm leading-snug tracking-meta text-fg-muted transition-colors hover:text-accent"
					>
						{item.number && <span className="text-accent">{item.number} — </span>}
						{item.title}
					</a>
				</li>
			))}
		</ol>
	);
}

/** Jump links to a page's sections. */
export function TableOfContents({ items, label, sticky = false, className }: TableOfContentsProps) {
	if (!sticky) {
		return (
			<nav aria-label={label} className={className}>
				<Items items={items} />
			</nav>
		);
	}
	return (
		<div className={className}>
			<details className="group border-y border-rule lg:hidden">
				<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-mono text-mono-sm tracking-label text-fg uppercase [&::-webkit-details-marker]:hidden">
					{label}
					<span aria-hidden="true" className="text-decor transition-transform group-open:rotate-45">
						+
					</span>
				</summary>
				<nav aria-label={label} className="pt-2 pb-5">
					<Items items={items} />
				</nav>
			</details>
			<nav
				aria-label={label}
				className={cn("hidden lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:block")}
			>
				<Items items={items} />
			</nav>
		</div>
	);
}
