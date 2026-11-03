import { createFileRoute } from "@tanstack/react-router";

import { getLegal, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { LegalPage } from "#/pages/LegalPage";

export const Route = createFileRoute("/terms")({
	loader: () => ({ document: getLegal("terms"), site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.document.title,
					description: loaderData.document.seo?.description,
					path: "/terms",
				})
			: {},
	component: LegalRoute,
});

function LegalRoute() {
	const { document } = Route.useLoaderData();
	return <LegalPage document={document} />;
}
