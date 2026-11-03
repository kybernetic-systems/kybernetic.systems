import { createFileRoute } from "@tanstack/react-router";

import { getHomePage, getPostSummaries, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { organizationJsonLd } from "#/lib/structured-data";
import { HomePage } from "#/pages/HomePage";

export const Route = createFileRoute("/")({
	loader: () => {
		const page = getHomePage();
		return { page, posts: getPostSummaries(page.featuredPostCount), site: getSite() };
	},
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.page.seo?.title ?? loaderData.site.shortName,
					fullTitle: true,
					description: loaderData.page.seo?.description,
					path: "/",
					// Google asks for this on one page only, so it lives here rather than in the root
					// route, and goes through `pageHead` to get the same script escaping as every other
					// block.
					jsonLd: organizationJsonLd(loaderData.site),
				})
			: {},
	component: HomeRoute,
});

function HomeRoute() {
	const { page, posts } = Route.useLoaderData();
	return <HomePage page={page} posts={posts} />;
}
