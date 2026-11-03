import { createFileRoute } from "@tanstack/react-router";

import { getProducts, getProductsPage, getSite } from "#/content/api";
import { pageHead } from "#/lib/seo";
import { ProductsPage } from "#/pages/ProductsPage";

export const Route = createFileRoute("/products")({
	loader: () => ({ page: getProductsPage(), products: getProducts(), site: getSite() }),
	head: ({ loaderData }) =>
		loaderData
			? pageHead({
					site: loaderData.site,
					title: loaderData.page.seo?.title ?? loaderData.page.intro.eyebrow,
					description: loaderData.page.seo?.description,
					path: "/products",
				})
			: {},
	component: ProductsRoute,
});

function ProductsRoute() {
	const { page, products, site } = Route.useLoaderData();
	return <ProductsPage page={page} products={products} site={site} />;
}
