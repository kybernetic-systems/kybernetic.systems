import { expect } from "storybook/test";

import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { MediaPlaceholder } from "./MediaPlaceholder";

const meta = preview.meta({
	title: "Primitives/MediaPlaceholder",
	component: MediaPlaceholder,
	tags: ["autodocs"],
	args: { caption: "product shot — 16:10", className: "w-96" },
});

export const Default = meta.story({
	play: async ({ canvasElement }) => {
		await expect(canvasElement.querySelector("[aria-hidden]")).toBeInTheDocument();
	},
});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<MediaPlaceholder caption="product shot — 16:10" />
			<MediaPlaceholder aspect="4/5" caption="portrait — 4:5" className="w-60" />
		</ToneMatrix>
	),
});
