import { expect, waitFor } from "storybook/test";

import { site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { MobileMenu } from "./MobileMenu";

const meta = preview.meta({
	title: "Layout/MobileMenu",
	component: MobileMenu,
	tags: ["autodocs"],
	args: { items: site.nav },
	globals: { viewport: { value: "mobile" } },
	parameters: { tanstack: { router: { route: { path: "/blog" } } } },
});

export const Closed = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("button", { name: "Menu" })).toHaveAttribute(
			"aria-expanded",
			"false",
		);
	},
});

export const OpenAndClose = meta.story({
	play: async ({ canvas, canvasElement, userEvent }) => {
		const button = canvas.getByRole("button", { name: "Menu" });
		await userEvent.click(button);
		await expect(button).toHaveAttribute("aria-expanded", "true");

		const dialog = canvasElement.querySelector("dialog");
		await expect(dialog).toHaveAttribute("open");
		await expect(dialog?.contains(document.activeElement)).toBe(true);
		const links = [...(dialog?.querySelectorAll("a") ?? [])].map((link) => link.textContent);
		await expect(links).toEqual(site.nav.map((item) => item.label));

		// Escape is handled natively by <dialog>; simulated key events can't trigger it, so this closes
		// through the button. Real Escape is checked against the running site.
		await userEvent.click(canvas.getByRole("button", { name: "Close" }));
		await waitFor(() => expect(dialog).not.toHaveAttribute("open"));
		await expect(button).toHaveAttribute("aria-expanded", "false");
		await expect(button).toHaveFocus();
	},
});
