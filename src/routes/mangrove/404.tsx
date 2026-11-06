import { createFileRoute } from "@tanstack/react-router";

import { getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { productOrigin } from "#/lib/subdomain";
import { NotFoundPage } from "#/pages/NotFoundPage";

/*
 * Mangrove's own not-found page, so a missing address on its subdomain keeps the product's
 * navigation instead of the company's. See `src/routes/404.tsx` for why this is a route.
 */
export const Route = createFileRoute("/mangrove/404")({
	loader: () => ({ site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: "Page not found",
					// Served from mangrove.kybernetic.systems, so the canonical URL is its own origin.
					path: "/404",
					origin: productOrigin("mangrove", loaderData.site.url),
					noindex: true,
				})
			: {},
	component: NotFoundPage,
});
