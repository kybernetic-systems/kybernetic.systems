import { createFileRoute } from "@tanstack/react-router";

import { getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { NotFoundPage } from "#/pages/NotFoundPage";

/*
 * A real route, so the prerenderer can render it: it only writes pages that answer 200, and a
 * not-found response never does. The build emits it as `404.html`, which Cloudflare serves — with
 * a 404 status — for any address that matches no asset. `noindex` keeps this stand-in out of
 * search results; the copies served for addresses that really are missing carry the 404 status
 * that tells a crawler the same thing.
 */
export const Route = createFileRoute("/404")({
	loader: () => ({ site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: "Page not found",
					path: "/404",
					noindex: true,
				})
			: {},
	component: NotFoundPage,
});
