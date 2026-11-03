import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Logo } from "./Logo";

const meta = preview.meta({
	title: "Primitives/Logo",
	component: Logo,
	tags: ["autodocs"],
	args: { className: "size-24" },
});

export const Labelled = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("img", { name: "Kybernetic Systems" })).toBeVisible();
	},
});

export const Decorative = meta.story({
	args: { decorative: true },
	play: async ({ canvas, canvasElement }) => {
		await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
		await expect(canvasElement.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
	},
});

export const Spinning = meta.story({
	args: { spin: true, className: "size-72" },
	play: async ({ canvasElement }) => {
		await expect(canvasElement.querySelector("svg")).toHaveClass("motion-safe:animate-helm");
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix className="justify-items-center">
			<Logo className="size-40" label="The helm and ouroboros mark of Kybernetic Systems" />
		</ToneMatrix>
	),
});
