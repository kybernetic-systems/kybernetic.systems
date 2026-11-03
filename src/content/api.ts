import type { Picture } from "#/components/primitives/Image/Image";
/*
 * The only module that reads content. Routes call these functions from their loaders; components
 * receive the results as props. Replacing the CMS means rewriting this file.
 */
import {
	about,
	allLegals,
	allPeople,
	allPosts,
	allProducts,
	allRoles,
	blogPage,
	careersPage,
	contactPage,
	home,
	mangrove,
	productsPage,
	site,
} from "#content-collections";
import type { Legal, Person, Post, Product, Role } from "#content-collections";

import { portraitPicture, productPicture } from "./images";

export type {
	About,
	BlogPage,
	CareersPage,
	ContactPage,
	Home,
	Legal,
	Mangrove,
	Post,
	ProductsPage,
	Role,
	Site,
} from "#content-collections";
export type { Hast, Heading, ProseElement, ProseNode, Section } from "./markdown";

export type PostSummary = Pick<
	Post,
	"slug" | "title" | "excerpt" | "publishedAt" | "tag" | "readingTime"
>;
export type RoleSummary = Pick<Role, "slug" | "title" | "status" | "timing" | "summary" | "tags">;
export type PersonWithPicture = Omit<Person, "portrait"> & {
	portrait: Person["portrait"] & { picture: Picture };
};
export type ProductWithPicture = Omit<Product, "media"> & {
	media?: NonNullable<Product["media"]> & { picture: Picture };
};

/** Drafts are visible in development and Storybook, never in production builds. */
const showDrafts = !import.meta.env.PROD;

const newestFirst = (a: Post, b: Post) => b.publishedAt.localeCompare(a.publishedAt);

function toPostSummary({ slug, title, excerpt, publishedAt, tag, readingTime }: Post): PostSummary {
	return { slug, title, excerpt, publishedAt, tag, readingTime };
}

export const getSite = () => site;
export const getHomePage = () => home;
export const getMangrovePage = () => mangrove;
export const getAboutPage = () => about;
export const getProductsPage = () => productsPage;
export const getBlogPage = () => blogPage;
export const getCareersPage = () => careersPage;
export const getContactPage = () => contactPage;

export function getPosts(): Post[] {
	return allPosts.filter((post) => showDrafts || !post.draft).toSorted(newestFirst);
}

export function getPostSummaries(limit?: number): PostSummary[] {
	return getPosts().slice(0, limit).map(toPostSummary);
}

export function getPost(slug: string): Post | undefined {
	return getPosts().find((post) => post.slug === slug);
}

/** The newest posts other than `slug`. */
export function getReadNext(slug: string, count: number): PostSummary[] {
	return getPosts()
		.filter((post) => post.slug !== slug)
		.slice(0, count)
		.map(toPostSummary);
}

const byOrder = (a: { order?: number | undefined; title: string }, b: typeof a) =>
	(a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY) ||
	a.title.localeCompare(b.title);

/** Roles shown on the Careers page. Closed roles are left out. */
export function getRoles(): RoleSummary[] {
	return allRoles
		.filter((role) => role.status !== "closed")
		.toSorted(byOrder)
		.map(({ slug, title, status, timing, summary, tags }) => ({
			slug,
			title,
			status,
			timing,
			summary,
			tags,
		}));
}

/** Any role, including closed ones, whose pages stay up. */
export function getRole(slug: string): Role | undefined {
	return allRoles.find((role) => role.slug === slug);
}

export function getAllRoleSlugs(): string[] {
	return allRoles.map((role) => role.slug);
}

function withPicture(product: Product): ProductWithPicture {
	const { media, ...rest } = product;
	if (!media) return rest;
	return { ...rest, media: { ...media, picture: productPicture(media.src) } };
}

export function getProducts(): ProductWithPicture[] {
	return allProducts
		.toSorted((a, b) =>
			byOrder({ order: a.order, title: a.name }, { order: b.order, title: b.name }),
		)
		.map(withPicture);
}

export function getPerson(slug: string): PersonWithPicture {
	const person = allPeople.find((candidate) => candidate.slug === slug);
	if (!person) {
		throw new Error(`No person "${slug}" in content/people`);
	}
	return {
		...person,
		portrait: { ...person.portrait, picture: portraitPicture(person.portrait.src) },
	};
}

export function getPeople(slugs: string[]): PersonWithPicture[] {
	return slugs.map(getPerson);
}

export function getLegal(slug: "privacy" | "terms"): Legal {
	const document = allLegals.find((candidate) => candidate.slug === slug);
	if (!document) {
		throw new Error(`Missing content/legal/${slug}.md`);
	}
	return document;
}
