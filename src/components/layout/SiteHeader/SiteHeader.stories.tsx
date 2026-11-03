import { expect } from "storybook/test";

import { site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { SiteHeader } from "./SiteHeader";

const meta = preview.meta({
	title: "Layout/SiteHeader",
	component: SiteHeader,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { nav: site.nav },
});

export const Home = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: "Kybernetic Systems" })).toHaveAttribute(
			"href",
			"/",
		);
		if (window.innerWidth >= 768) {
			const nav = canvas.getByRole("navigation", { name: "Primary" });
			await expect(nav).toBeVisible();
			await expect(nav.querySelectorAll("[aria-current]")).toHaveLength(0);
		} else {
			await expect(canvas.getByRole("button", { name: "Menu" })).toBeVisible();
		}
	},
});

export const OnAboutPage = meta.story({
	parameters: { tanstack: { router: { route: { path: "/about" } } } },
	play: async ({ canvasElement }) => {
		const current = canvasElement.querySelector('nav[aria-label="Primary"] [aria-current="page"]');
		await expect(current).toHaveTextContent("About");
	},
});

export const OnBlogPost = meta.story({
	parameters: {
		tanstack: { router: { route: { path: "/blog/$slug" }, params: { slug: "complex-domains" } } },
	},
	play: async ({ canvasElement }) => {
		const current = canvasElement.querySelector('nav[aria-label="Primary"] [aria-current]');
		await expect(current).toHaveTextContent("Blog");
		await expect(current).toHaveAttribute("aria-current", "true");
	},
});

export const OnRolePage = meta.story({
	parameters: {
		tanstack: {
			router: { route: { path: "/careers/$slug" }, params: { slug: "founding-engineer" } },
		},
	},
	play: async ({ canvasElement }) => {
		const current = canvasElement.querySelector('nav[aria-label="Primary"] [aria-current]');
		await expect(current).toHaveTextContent("Careers");
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
