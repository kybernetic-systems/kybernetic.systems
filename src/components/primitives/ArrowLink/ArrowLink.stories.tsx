import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { ArrowLink } from "./ArrowLink";

const meta = preview.meta({
	title: "Primitives/ArrowLink",
	component: ArrowLink,
	tags: ["autodocs"],
	args: { href: "/products", children: "See all products" },
});

export const CallToAction = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: "See all products" })).toBeVisible();
	},
});

export const Text = meta.story({
	args: { appearance: "text", href: "/blog", children: "All posts" },
});

export const Back = meta.story({
	args: { appearance: "label", direction: "back", href: "/blog", children: "All posts" },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: "All posts" })).toBeVisible();
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix className="justify-items-start">
			<ArrowLink href="/careers">Roles and how we hire</ArrowLink>
			<ArrowLink href="/blog" appearance="text">
				All posts
			</ArrowLink>
			<ArrowLink href="/blog" appearance="label" direction="back">
				All posts
			</ArrowLink>
		</ToneMatrix>
	),
});
