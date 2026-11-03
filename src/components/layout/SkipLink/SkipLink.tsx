/** The first focusable element on every page: jumps past the header to the main content. */
export function SkipLink() {
	return (
		<a
			href="#main"
			className="sr-only z-60 bg-fg px-4 py-3 font-serif text-body text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
		>
			Skip to content
		</a>
	);
}
