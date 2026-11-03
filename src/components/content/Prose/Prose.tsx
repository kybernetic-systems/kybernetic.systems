import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { Heading } from "#/components/primitives/Heading/Heading";
import { Link } from "#/components/primitives/Link/Link";
import { Rule } from "#/components/primitives/Rule/Rule";
import type { Hast, ProseNode } from "#/content/api";
import { tv } from "#/lib/tv";

const prose = tv({
	slots: {
		root: "min-w-0",
		p: "m-0 font-serif text-fg-body [&:not(:last-child)]:mb-6.5",
		h2: "mt-14 mb-5 first:mt-0",
		h3: "mt-10 mb-4 first:mt-0",
		quote:
			"my-12 border-l-2 border-decor pl-6 font-serif text-heading-lg text-fg italic md:pl-8 [&_p]:m-0 [&_p]:text-inherit",
		list: "my-6 grid gap-2 pl-6 font-serif text-fg-body marker:text-decor",
		em: "italic",
		strong: "font-semibold text-fg",
	},
	variants: {
		size: {
			"statement": { p: "text-statement text-fg" },
			"body-lg": { p: "text-body-lg", list: "text-body-lg" },
			"body": { p: "text-body", list: "text-body" },
			"body-sm": { p: "text-body-sm", list: "text-body-sm" },
		},
		tone: {
			body: {},
			muted: { p: "text-fg-muted", list: "text-fg-muted" },
			subtle: { p: "text-fg-subtle", list: "text-fg-subtle" },
		},
		emphasis: {
			default: {},
			accent: { em: "text-accent" },
		},
	},
	defaultVariants: { size: "body-lg", tone: "body", emphasis: "default" },
});

export type ProseProps = VariantProps<typeof prose> & {
	content: Hast;
	/** Render only the text runs, for Markdown placed inside an existing element. */
	inline?: boolean;
	/** The outline level `##` headings map to. */
	headingLevel?: 2 | 3;
	className?: string | undefined;
};

type Styles = ReturnType<typeof prose>;
type Context = { styles: Styles; headingLevel: 2 | 3 };

function renderChildren(nodes: ProseNode[], context: Context): ReactNode[] {
	return nodes.map((node, index) => renderNode(node, index, context));
}

function renderNode(node: ProseNode, key: number, context: Context): ReactNode {
	if (node.type === "text") return node.value;
	const { styles, headingLevel } = context;
	const children = renderChildren(node.children, context);
	switch (node.tagName) {
		case "p":
			return (
				<p key={key} className={styles.p()}>
					{children}
				</p>
			);
		case "h2":
			return (
				<Heading
					key={key}
					level={headingLevel}
					size="heading-lg"
					id={node.properties.id}
					className={styles.h2()}
				>
					{children}
				</Heading>
			);
		case "h3":
		case "h4":
			return (
				<Heading
					key={key}
					level={headingLevel === 2 ? 3 : 4}
					size="heading-md"
					id={node.properties.id}
					className={styles.h3()}
				>
					{children}
				</Heading>
			);
		case "blockquote":
			return (
				<blockquote key={key} className={styles.quote()}>
					{children}
				</blockquote>
			);
		case "ul":
			return (
				<ul key={key} className={styles.list({ className: "list-disc" })}>
					{children}
				</ul>
			);
		case "ol":
			return (
				<ol
					key={key}
					start={node.properties.start}
					className={styles.list({ className: "list-decimal" })}
				>
					{children}
				</ol>
			);
		case "li":
			return <li key={key}>{children}</li>;
		case "a":
			return node.properties.href ? (
				<Link key={key} href={node.properties.href}>
					{children}
				</Link>
			) : (
				children
			);
		case "em":
			return (
				<em key={key} className={styles.em()}>
					{children}
				</em>
			);
		case "strong":
			return (
				<strong key={key} className={styles.strong()}>
					{children}
				</strong>
			);
		case "code":
			return (
				<code key={key} className="font-mono text-[0.9em]">
					{children}
				</code>
			);
		case "br":
			return <br key={key} />;
		case "hr":
			return <Rule key={key} separator className="my-10" />;
		default:
			// Anything else Markdown can produce renders as its text, never as arbitrary HTML.
			return <span key={key}>{children}</span>;
	}
}

/** Renders compiled Markdown with the design's typography. */
export function Prose({
	content,
	inline = false,
	headingLevel = 2,
	size,
	tone,
	emphasis,
	className,
}: ProseProps) {
	const styles = prose({ size, tone, emphasis });
	const children = renderChildren(content.children, { styles, headingLevel });
	return inline ? children : <div className={styles.root({ className })}>{children}</div>;
}
