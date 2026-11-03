/*
 * Markdown → a JSON tree at build time. The tree ships in the bundle and renders through `Prose`
 * without evaluating code (Cloudflare Workers forbid `eval`).
 * Imported by `content-collections.ts`, so this module uses relative imports only.
 */
import type { Root as HastRoot, RootContent as HastContent } from "hast";
import { toHtml } from "hast-util-to-html";
import type { Root as MdastRoot } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { z } from "zod";

/** A rendered-text node. */
export type ProseText = { type: "text"; value: string };

/** An HTML element with the few attributes Markdown produces. */
export type ProseElement = {
	type: "element";
	tagName: string;
	properties: { id?: string; href?: string; start?: number };
	children: ProseNode[];
};

export type ProseNode = ProseElement | ProseText;

/** Compiled Markdown: plain JSON, safe to bundle and serialize. */
export type Hast = { type: "root"; children: ProseNode[] };

export type Heading = { id: string; text: string };

export type Section = { id: string; number: string; title: string; body: Hast };

const parser = unified().use(remarkParse).use(remarkGfm);
const compiler = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug);

function toProseNodes(nodes: HastContent[]): ProseNode[] {
	return nodes.flatMap((node): ProseNode[] => {
		if (node.type === "text") {
			return [{ type: "text", value: node.value }];
		}
		if (node.type !== "element") {
			// Comments, doctypes and raw HTML never reach the page.
			return [];
		}
		const { id, href, start } = node.properties;
		const properties: ProseElement["properties"] = {};
		if (typeof id === "string") properties.id = id;
		if (typeof href === "string") properties.href = href;
		if (typeof start === "number") properties.start = start;
		return [
			{ type: "element", tagName: node.tagName, properties, children: toProseNodes(node.children) },
		];
	});
}

function parse(markdown: string): MdastRoot {
	return parser.parse(markdown);
}

/** Compiles block Markdown (paragraphs, headings, lists, quotes) to a JSON tree. */
export function markdownToHast(markdown: string): Hast {
	const root: HastRoot = compiler.runSync(compiler.parse(markdown));
	return { type: "root", children: toProseNodes(root.children) };
}

/**
 * Compiles Markdown to an HTML string. Job search engines want a posting's description as HTML
 * rather than a JSON tree; Google renders `<p>`, `<ul>` and `<li>` and ignores the rest.
 */
export function markdownToHtml(markdown: string): string {
	return toHtml(compiler.runSync(compiler.parse(markdown)));
}

/**
 * Compiles a single line of Markdown (emphasis, links) without the wrapping paragraph, for text
 * placed inside an existing heading or paragraph.
 */
export function inlineMarkdownToHast(markdown: string): Hast {
	const root = markdownToHast(markdown);
	const [first] = root.children;
	if (root.children.length !== 1 || first?.type !== "element" || first.tagName !== "p") {
		throw new Error(
			`Expected a single line of text, got block content: "${markdown.slice(0, 60)}…"`,
		);
	}
	return { type: "root", children: first.children };
}

/** Plain text of Markdown, for reading-time estimates. */
export function markdownToText(markdown: string): string {
	return mdastToString(parse(markdown));
}

/** Plain text of a compiled node. */
export function textOf(node: ProseNode | Hast): string {
	return node.type === "text" ? node.value : node.children.map(textOf).join("");
}

function isHeading(node: ProseNode): node is ProseElement {
	return node.type === "element" && node.tagName === "h2";
}

/** The `##` headings of compiled Markdown, with the ids `rehype-slug` gave them. */
export function extractHeadings(root: Hast): Heading[] {
	return root.children
		.filter(isHeading)
		.map((node) => ({ id: node.properties.id ?? "", text: textOf(node) }));
}

/** Splits compiled Markdown into numbered sections at each `##` heading. */
export function splitSections(root: Hast): Section[] {
	const sections: Section[] = [];
	for (const node of root.children) {
		const current = sections.at(-1);
		if (isHeading(node)) {
			sections.push({
				id: node.properties.id ?? "",
				number: String(sections.length + 1).padStart(2, "0"),
				title: textOf(node),
				body: { type: "root", children: [] },
			});
		} else if (current) {
			current.body.children.push(node);
		} else if (node.type !== "text" || node.value.trim() !== "") {
			throw new Error("Text before the first ## heading has no section to belong to");
		}
	}
	return sections;
}

export type SiteTokens = {
	legalName: string;
	shortName: string;
	email: string;
	cin: string;
	phone: { display: string };
	registeredOffice: { lines: string[] };
};

/**
 * Replaces `{site.email}`-style placeholders so contact details are written once, in `site.toml`.
 * Unknown placeholders fail the build instead of shipping literally.
 */
export function interpolate(
	text: string,
	site: SiteTokens,
	escape: (value: string) => string = (value) => value,
): string {
	const tokens: Record<string, string> = {
		"site.legalName": site.legalName,
		"site.shortName": site.shortName,
		"site.email": site.email,
		"site.cin": site.cin,
		"site.phone": site.phone.display,
		"site.registeredOffice": site.registeredOffice.lines.join(", "),
	};
	return text.replaceAll(/\{(site\.[a-zA-Z]+)\}/gu, (match, key: string) => {
		const value = tokens[key];
		if (value === undefined) {
			throw new Error(
				`Unknown placeholder ${match}. Use one of: {${Object.keys(tokens).join("}, {")}}`,
			);
		}
		return escape(value);
	});
}

/**
 * Applies `interpolate` to every string in a YAML document, then validates the result against the
 * document's schema again, so the output stays fully typed.
 */
export function interpolateDocument<Schema extends z.ZodType>(
	schema: Schema,
	document: z.input<Schema>,
	site: SiteTokens,
): z.output<Schema> {
	const json = interpolate(JSON.stringify(document), site, (value) =>
		JSON.stringify(value).slice(1, -1),
	);
	return schema.parse(JSON.parse(json));
}
