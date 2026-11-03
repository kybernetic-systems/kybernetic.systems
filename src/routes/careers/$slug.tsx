import { createFileRoute, notFound } from "@tanstack/react-router";

import { getCareersPage, getRole, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { jobPostingJsonLd } from "#/lib/structured-data";
import { RolePage } from "#/pages/RolePage";

export const Route = createFileRoute("/careers/$slug")({
	loader: ({ params }) => {
		const role = getRole(params.slug);
		if (!role) throw notFound();
		return { role, page: getCareersPage(), site: getSite() };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { role, page, site } = loaderData;
		// Returns nothing unless somebody can apply today; see `jobPostingJsonLd`.
		const jobPosting = jobPostingJsonLd(role, site);
		return pageHead({
			site,
			title: `${role.title} · ${page.intro.eyebrow}`,
			description: role.summary,
			path: `/careers/${role.slug}`,
			noindex: role.status === "closed",
			...(jobPosting ? { jsonLd: jobPosting } : {}),
		});
	},
	component: RoleRoute,
});

function RoleRoute() {
	const { role, page, site } = Route.useLoaderData();
	return <RolePage role={role} page={page} site={site} />;
}
