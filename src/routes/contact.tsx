import { createFileRoute } from "@tanstack/react-router";

import { getContactPage, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { ContactPage } from "#/pages/ContactPage";

export const Route = createFileRoute("/contact")({
	loader: () => ({ page: getContactPage(), site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.page.seo?.title ?? loaderData.page.intro.eyebrow,
					description: loaderData.page.seo?.description,
					path: "/contact",
				})
			: {},
	component: ContactRoute,
});

function ContactRoute() {
	const { page, site } = Route.useLoaderData();
	return <ContactPage page={page} site={site} />;
}
