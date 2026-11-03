export type ContentStatusBadgeProps = {
	/** What's pending, e.g. "Placeholder copy" or "Pending counsel review". */
	label: string;
	className?: string | undefined;
};

/** Whether content status badges render: in `vp dev` and Storybook, never in production builds. */
export const showContentStatus = import.meta.env.DEV || import.meta.env.STORYBOOK === "true";

/** Dev-only reminder that a piece of content still needs work. Renders nothing in production. */
export function ContentStatusBadge({ label, className }: ContentStatusBadgeProps) {
	if (!showContentStatus) return null;
	return (
		<p
			role="note"
			className={`m-0 inline-block border border-dashed border-fg-muted px-3 py-1.5 font-mono text-mono-xs tracking-meta text-fg-muted uppercase ${className ?? ""}`}
		>
			Dev only · {label}
		</p>
	);
}
