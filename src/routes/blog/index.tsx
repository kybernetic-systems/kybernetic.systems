import { createFileRoute } from "@tanstack/react-router";

import { getBlogPage, getPostSummaries, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { BlogPage } from "#/pages/BlogPage";

export const Route = createFileRoute("/blog/")({
	loader: () => ({ page: getBlogPage(), posts: getPostSummaries(), site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.page.seo?.title ?? loaderData.page.intro.eyebrow,
					description: loaderData.page.seo?.description,
					path: "/blog",
				})
			: {},
	component: BlogRoute,
});

function BlogRoute() {
	const { page, posts } = Route.useLoaderData();
	return <BlogPage page={page} posts={posts} />;
}
