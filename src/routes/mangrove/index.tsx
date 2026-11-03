import { createFileRoute } from "@tanstack/react-router";

import { getMangrovePage, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { productOrigin } from "#/lib/subdomain";
import { MangrovePage } from "#/pages/MangrovePage";

export const Route = createFileRoute("/mangrove/")({
	loader: () => ({ page: getMangrovePage(), site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.page.seo?.title ?? loaderData.page.hero.eyebrow,
					description: loaderData.page.seo?.description,
					// Served from mangrove.kybernetic.systems, so the canonical URL is its own origin.
					path: "/",
					origin: productOrigin("mangrove", loaderData.site.url),
				})
			: {},
	component: MangroveRoute,
});

function MangroveRoute() {
	const { page, site } = Route.useLoaderData();
	return <MangrovePage page={page} site={site} />;
}
