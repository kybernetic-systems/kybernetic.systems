import { products, productsPage, site } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { ProductsPage } from "./ProductsPage";

const meta = preview.meta({
	title: "Pages/Products",
	component: ProductsPage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/products" } } } },
	args: { page: productsPage, products, site },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<ProductsPage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvasElement }) => {
		await expectWellFormedPage(canvasElement);
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
