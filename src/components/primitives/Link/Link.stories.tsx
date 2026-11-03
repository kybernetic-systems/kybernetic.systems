import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Link } from "./Link";

const meta = preview.meta({
	title: "Primitives/Link",
	component: Link,
	tags: ["autodocs"],
	args: { href: "/about", children: "About the company" },
});

export const Inline = meta.story({
	play: async ({ canvas, userEvent }) => {
		const link = canvas.getByRole("link", { name: "About the company" });
		await expect(link).toHaveAttribute("href", "/about");
		await userEvent.tab();
		await expect(link).toHaveFocus();
	},
});

export const CurrentPage = meta.story({
	args: { href: "/", variant: "nav", children: "Home" },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
			"aria-current",
			"page",
		);
	},
});

export const Email = meta.story({
	args: {
		href: "mailto:adit.shah@kybernetic.systems",
		variant: "underline",
		children: "adit.shah@kybernetic.systems",
	},
	play: async ({ canvas }) => {
		const link = canvas.getByRole("link");
		await expect(link).toHaveAttribute("href", "mailto:adit.shah@kybernetic.systems");
		await expect(link).not.toHaveAttribute("aria-current");
	},
});

export const ExternalNewTab = meta.story({
	args: { href: "https://example.com", newTab: true, children: "Cynefin framework" },
	play: async ({ canvas }) => {
		const link = canvas.getByRole("link", { name: "Cynefin framework (opens in a new tab)" });
		await expect(link).toHaveAttribute("target", "_blank");
		await expect(link).toHaveAttribute("rel", "noopener noreferrer");
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<p className="m-0 text-body text-fg-body">
				Read the <Link href="/privacy">privacy policy</Link> for details.
			</p>
			<Link
				href="mailto:adit.shah@kybernetic.systems"
				variant="underline"
				className="text-heading-md"
			>
				adit.shah@kybernetic.systems
			</Link>
			<Link href="/careers" variant="nav" className="text-body">
				Careers
			</Link>
			<Link href="/terms" variant="footer" className="text-body">
				Terms of Use
			</Link>
		</ToneMatrix>
	),
});
