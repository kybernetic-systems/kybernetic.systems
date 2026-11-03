import { createFileRoute } from "@tanstack/react-router";

import { getAboutPage, getPeople, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { AboutPage } from "#/pages/AboutPage";

export const Route = createFileRoute("/about")({
	loader: () => {
		const page = getAboutPage();
		return { page, people: getPeople(page.team.people), site: getSite() };
	},
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.page.seo?.title ?? loaderData.page.intro.eyebrow,
					description: loaderData.page.seo?.description,
					path: "/about",
				})
			: {},
	component: AboutRoute,
});

function AboutRoute() {
	const { page, people } = Route.useLoaderData();
	return <AboutPage page={page} people={people} />;
}
