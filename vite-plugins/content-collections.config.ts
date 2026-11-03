import {
	defineCollection,
	defineConfig,
	defineParser,
	defineSingleton,
} from "@content-collections/core";
import { parse as parseToml } from "smol-toml";

import {
	extractHeadings,
	inlineMarkdownToHast,
	interpolateDocument,
	markdownToHast,
	markdownToHtml,
	markdownToText,
	splitSections,
} from "#/content/markdown";
import type { SiteTokens } from "#/content/markdown";
import {
	aboutSchema,
	blogPageSchema,
	careersPageSchema,
	contactPageSchema,
	homeSchema,
	legalSchema,
	mangroveSchema,
	personSchema,
	postSchema,
	productSchema,
	productsPageSchema,
	recommendedRoleSections,
	roleSchema,
	siteSchema,
} from "#/content/schema";
import { readingTime } from "#/lib/reading-time";

/*
 * Collection paths are relative to this file, so they step out of `vite-plugins/`. Content Collections
 * takes this file's directory as its base directory and writes its generated output beside it.
 */
/** Content Collections ships yaml and json only; the singletons are TOML. */
const toml = defineParser((content: string) => parseToml(content) as Record<string, unknown>);

const site = defineSingleton({
	name: "site",
	filePath: "../content/singletons/site.toml",
	parser: toml,
	schema: siteSchema,
});

type Context = { documents: (source: typeof site) => SiteTokens[] };

function siteTokens(context: Context): SiteTokens {
	const [tokens] = context.documents(site);
	if (!tokens) throw new Error("content/singletons/site.toml is missing");
	return tokens;
}

/** Content paths like `./adit-shah.webp` become project-root paths, as `src/content/images.ts` expects. */
function contentPath(directory: string, src: string) {
	return `/content/${directory}/${src.replace(/^\.\//u, "")}`;
}

const posts = defineCollection({
	name: "posts",
	directory: "../content/posts",
	include: "*.md",
	schema: postSchema,
	transform: ({ _meta, ...document }, context) => {
		const { content, ...post } = interpolateDocument(postSchema, document, siteTokens(context));
		return {
			...post,
			slug: _meta.path,
			readingTime: readingTime(markdownToText(content)),
			body: markdownToHast(content),
		};
	},
});

const roles = defineCollection({
	name: "roles",
	directory: "../content/roles",
	include: "*.md",
	exclude: "_*.md",
	schema: roleSchema,
	transform: ({ _meta, ...document }, context) => {
		const { content, ...role } = interpolateDocument(roleSchema, document, siteTokens(context));
		const body = markdownToHast(content);
		const headings = extractHeadings(body);
		const present = new Set(headings.map((heading) => heading.text.toLowerCase()));
		const missing = recommendedRoleSections.filter(
			(section) => !present.has(section.toLowerCase()),
		);
		if (missing.length > 0) {
			console.warn(
				`content/roles/${_meta.filePath}: missing recommended section${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`,
			);
		}
		return {
			...role,
			slug: _meta.path,
			applySubject: role.applySubject ?? role.title,
			body,
			// Job search engines want the whole description as HTML, not the one-line summary.
			descriptionHtml: markdownToHtml(content),
			headings,
		};
	},
});

const products = defineCollection({
	name: "products",
	directory: "../content/products",
	include: "*.md",
	schema: productSchema,
	transform: ({ _meta, ...document }, context) => {
		const { content, media, ...product } = interpolateDocument(
			productSchema,
			document,
			siteTokens(context),
		);
		return {
			...product,
			slug: _meta.path,
			media: media && { ...media, src: contentPath("products", media.src) },
			body: markdownToHast(content),
		};
	},
});

const people = defineCollection({
	name: "people",
	directory: "../content/people",
	include: "*.md",
	schema: personSchema,
	transform: ({ _meta, ...document }, context) => {
		const { content, portrait, ...person } = interpolateDocument(
			personSchema,
			document,
			siteTokens(context),
		);
		return {
			...person,
			slug: _meta.path,
			portrait: { ...portrait, src: contentPath("people", portrait.src) },
			bio: markdownToHast(content),
		};
	},
});

const legal = defineCollection({
	name: "legal",
	directory: "../content/legal",
	include: "*.md",
	schema: legalSchema,
	transform: ({ _meta, ...document }, context) => {
		const { content, ...legalDocument } = interpolateDocument(
			legalSchema,
			document,
			siteTokens(context),
		);
		return { ...legalDocument, slug: _meta.path, sections: splitSections(markdownToHast(content)) };
	},
});

const home = defineSingleton({
	name: "home",
	filePath: "../content/singletons/home.toml",
	parser: toml,
	schema: homeSchema,
	transform: ({ _meta, ...document }, context) => {
		const page = interpolateDocument(homeSchema, document, siteTokens(context));
		return {
			...page,
			cause: {
				eyebrow: page.cause.eyebrow,
				statements: page.cause.statements.map(inlineMarkdownToHast),
			},
			name: { ...page.name, body: markdownToHast(page.name.body) },
		};
	},
});

const about = defineSingleton({
	name: "about",
	filePath: "../content/singletons/about.toml",
	parser: toml,
	schema: aboutSchema,
	transform: ({ _meta, ...document }, context) => {
		const page = interpolateDocument(aboutSchema, document, siteTokens(context));
		return {
			...page,
			thinking: { eyebrow: page.thinking.eyebrow, body: markdownToHast(page.thinking.body) },
		};
	},
});

const productsPage = defineSingleton({
	name: "productsPage",
	filePath: "../content/singletons/products.toml",
	parser: toml,
	schema: productsPageSchema,
	transform: ({ _meta, ...document }, context) => {
		const page = interpolateDocument(productsPageSchema, document, siteTokens(context));
		return {
			...page,
			notify: { ...page.notify, privacyNote: inlineMarkdownToHast(page.notify.privacyNote) },
		};
	},
});

const mangrove = defineSingleton({
	name: "mangrove",
	filePath: "../content/singletons/mangrove.toml",
	parser: toml,
	schema: mangroveSchema,
	transform: ({ _meta, ...document }, context) => {
		const page = interpolateDocument(mangroveSchema, document, siteTokens(context));
		return {
			...page,
			premise: {
				eyebrow: page.premise.eyebrow,
				statements: page.premise.statements.map(inlineMarkdownToHast),
			},
			sovereignty: {
				eyebrow: page.sovereignty.eyebrow,
				body: markdownToHast(page.sovereignty.body),
			},
			notify: { ...page.notify, privacyNote: inlineMarkdownToHast(page.notify.privacyNote) },
		};
	},
});

const blogPage = defineSingleton({
	name: "blogPage",
	filePath: "../content/singletons/blog.toml",
	parser: toml,
	schema: blogPageSchema,
	transform: ({ _meta, ...document }, context) =>
		interpolateDocument(blogPageSchema, document, siteTokens(context)),
});

const careersPage = defineSingleton({
	name: "careersPage",
	filePath: "../content/singletons/careers.toml",
	parser: toml,
	schema: careersPageSchema,
	transform: ({ _meta, ...document }, context) => {
		const page = interpolateDocument(careersPageSchema, document, siteTokens(context));
		return {
			...page,
			commitments: {
				eyebrow: page.commitments.eyebrow,
				body: markdownToHast(page.commitments.body),
			},
			honesty: { eyebrow: page.honesty.eyebrow, body: markdownToHast(page.honesty.body) },
			rolePage: { ...page.rolePage, applyBody: markdownToHast(page.rolePage.applyBody) },
		};
	},
});

const contactPage = defineSingleton({
	name: "contactPage",
	filePath: "../content/singletons/contact.toml",
	parser: toml,
	schema: contactPageSchema,
	transform: ({ _meta, ...document }, context) => {
		const page = interpolateDocument(contactPageSchema, document, siteTokens(context));
		return {
			...page,
			writeToUs: {
				...page.writeToUs,
				privacyNote: inlineMarkdownToHast(page.writeToUs.privacyNote),
			},
		};
	},
});

export default defineConfig({
	content: [
		site,
		home,
		about,
		productsPage,
		mangrove,
		blogPage,
		careersPage,
		contactPage,
		posts,
		roles,
		products,
		people,
		legal,
	],
});
