import { createFileRoute, notFound } from "@tanstack/react-router";

import { getBlogPage, getPerson, getPost, getReadNext, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { blogPostingJsonLd } from "#/lib/structured-data";
import { PostPage } from "#/pages/PostPage";

export const Route = createFileRoute("/blog/$slug")({
	loader: ({ params }) => {
		const post = getPost(params.slug);
		if (!post) throw notFound();
		const page = getBlogPage();
		return {
			post,
			page,
			readNext: getReadNext(post.slug, page.readNextCount),
			author: getPerson(post.author).name,
			site: getSite(),
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { post, site, author } = loaderData;
		const path = `/blog/${post.slug}`;
		return pageHead({
			site,
			title: post.seo?.title ?? post.title,
			description: post.seo?.description ?? post.excerpt,
			path,
			type: "article",
			image: post.seo?.ogImage ? { src: post.seo.ogImage, alt: post.title } : undefined,
			jsonLd: blogPostingJsonLd(post, site, author),
		});
	},
	component: PostRoute,
});

function PostRoute() {
	const { post, page, readNext, author, site } = Route.useLoaderData();
	return (
		<PostPage
			post={post}
			page={page}
			readNext={readNext}
			author={author}
			organization={site.shortName}
		/>
	);
}
