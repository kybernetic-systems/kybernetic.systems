import { Logo } from "#/components/primitives/Logo/Logo";

export type ArticleBylineProps = { author: string; organization: string };

/** Signs off a post. */
export function ArticleByline({ author, organization }: ArticleBylineProps) {
	return (
		<footer className="mt-16 flex items-center gap-3.5 border-t border-rule pt-7 md:mt-18">
			<Logo decorative className="size-6.5" />
			<p className="m-0 font-mono text-mono-sm tracking-meta text-fg-muted">
				{author} · {organization}
			</p>
		</footer>
	);
}
