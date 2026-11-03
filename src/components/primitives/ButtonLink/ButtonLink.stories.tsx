import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { ButtonLink } from "./ButtonLink";

const meta = preview.meta({
	title: "Primitives/ButtonLink",
	component: ButtonLink,
	tags: ["autodocs"],
	args: {
		href: "mailto:adit.shah@kybernetic.systems?subject=Open%20application",
		children: "Write to us",
	},
});

export const Ink = meta.story({
	play: async ({ canvas, userEvent }) => {
		const link = canvas.getByRole("link", { name: "Write to us" });
		await userEvent.tab();
		await expect(link).toHaveFocus();
	},
});

export const Brass = meta.story({
	args: { intent: "brass", children: "Email us to be notified" },
	globals: { tone: "ink" },
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix className="justify-items-start">
			<ButtonLink href="mailto:adit.shah@kybernetic.systems">Write to us</ButtonLink>
			<ButtonLink href="mailto:adit.shah@kybernetic.systems" intent="brass">
				Email us to be notified
			</ButtonLink>
			<ButtonLink href="mailto:adit.shah@kybernetic.systems" block>
				Full width on mobile
			</ButtonLink>
		</ToneMatrix>
	),
});
