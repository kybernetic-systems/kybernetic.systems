import { createFileRoute } from "@tanstack/react-router";

import { getCareersPage, getRoles, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { CareersPage } from "#/pages/CareersPage";

export const Route = createFileRoute("/careers/")({
	loader: () => ({ page: getCareersPage(), roles: getRoles(), site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.page.seo?.title ?? loaderData.page.intro.eyebrow,
					description: loaderData.page.seo?.description,
					path: "/careers",
				})
			: {},
	component: CareersRoute,
});

function CareersRoute() {
	const { page, roles, site } = Route.useLoaderData();
	return <CareersPage page={page} roles={roles} site={site} />;
}
