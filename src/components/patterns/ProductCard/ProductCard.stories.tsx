import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { externalProduct, product } from "#/content/fixtures";
import preview from "#storybook/preview";

import { ProductCard } from "./ProductCard";

const meta = preview.meta({
	title: "Patterns/ProductCard",
	component: ProductCard,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { product },
	decorators: [
		(Story) => (
			<Container className="py-12">
				<Story />
			</Container>
		),
	],
});

export const WithoutMedia = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByText("product shot — 16:10").parentElement).toHaveAttribute(
			"aria-hidden",
			"true",
		);
	},
});

export const ExternalLink = meta.story({
	args: { product: externalProduct },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: "Telemetry" })).toHaveAttribute(
			"href",
			"https://example.com",
		);
	},
});
