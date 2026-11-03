import { createRouter } from "@tanstack/react-router";

import { getSite } from "#/content/api";
import { createSubdomainRewrite } from "#/lib/subdomain";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		rewrite: createSubdomainRewrite(getSite().url),
	});
}
