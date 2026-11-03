/*
 * Story and test data: the real content, plus edge cases the real content doesn't have yet.
 */
import { readingTime } from "#/lib/reading-time";

import {
	getAboutPage,
	getBlogPage,
	getCareersPage,
	getContactPage,
	getHomePage,
	getLegal,
	getMangrovePage,
	getPeople,
	getPerson,
	getProducts,
	getProductsPage,
	getRole,
	getRoles,
	getSite,
} from "./api";
import type { Post, PostSummary, ProductWithPicture, Role, RoleSummary } from "./api";
import { markdownToHast } from "./markdown";

function required<T>(value: T | undefined, name: string): T {
	if (value === undefined) throw new Error(`Fixture content "${name}" is missing`);
	return value;
}

function toSummary({
	slug,
	title,
	excerpt,
	publishedAt,
	tag,
	readingTime: time,
}: Post): PostSummary {
	return { slug, title, excerpt, publishedAt, tag, readingTime: time };
}

export const site = getSite();
export const homePage = getHomePage();
export const aboutPage = getAboutPage();
export const productsPage = getProductsPage();
export const mangrovePage = getMangrovePage();
export const blogPage = getBlogPage();
export const careersPage = getCareersPage();
export const contactPage = getContactPage();

/*
 * Posts are invented rather than read from `content/posts`, which is empty until the first real
 * post is written. Stories need a post to render, and a placeholder here is better than a
 * placeholder in the content directory, where it could reach the site.
 */
const postBody = `
Steering is the clearest everyday example of governing by feedback. A helmsman does not compute
the whole path from the harbour; they hold a heading, notice drift, and correct.

## The correction is the interesting part

> A system's behavior is set less by its parts than by its loops.

Most plans spend themselves on the first calculation and leave the correcting thin.
`;

function examplePost(overrides: Partial<Post> = {}): Post {
	return {
		slug: "example-post",
		title: "Governing by correction rather than prediction",
		excerpt: "A plan tells you where you meant to go. Only feedback tells you where you are.",
		publishedAt: "2026-01-15",
		tag: "Cybernetics",
		author: "adit-shah",
		draft: false,
		readingTime: readingTime(postBody),
		body: markdownToHast(postBody),
		...overrides,
	};
}

export const post: Post = examplePost();

export const postSummary: PostSummary = toSummary(post);

// Four, so `featuredPosts` and `readNext` can each take three.
export const posts: PostSummary[] = [
	postSummary,
	toSummary(
		examplePost({ slug: "second-post", title: "What we got wrong about queues", tag: "Product" }),
	),
	toSummary(
		examplePost({ slug: "fourth-post", title: "Small tools, and when to stop", tag: "Practice" }),
	),
	toSummary(
		examplePost({ slug: "third-post", title: "Reading the room, and the logs", tag: "Practice" }),
	),
];

export const featuredPosts = posts.slice(0, homePage.featuredPostCount);
export const readNext = posts.slice(1, 1 + blogPage.readNextCount);

export const longTitlePost: PostSummary = {
	...postSummary,
	slug: "long-title",
	title:
		"Requisite variety, loop latency and the slow death of the quarterly roadmap in organizations that stopped listening",
	tag: "Organizational cybernetics",
};

export const roles: RoleSummary[] = getRoles();
export const role: Role = required(getRole("internship"), "internship");
export const roleSummary: RoleSummary = required(roles[0], "first role");
export const openRole: RoleSummary = { ...roleSummary, status: "open" };
export const closedRole: Role = { ...role, status: "closed", copyStatus: "final" };

export const person = getPerson("adit-shah");
export const people = getPeople(aboutPage.team.people);

export const products: ProductWithPicture[] = getProducts();
export const product: ProductWithPicture = required(products[0], "first product");
export const externalProduct: ProductWithPicture = {
	...product,
	slug: "telemetry",
	name: "Telemetry",
	url: "https://example.com",
};

export const privacy = getLegal("privacy");
export const terms = getLegal("terms");
