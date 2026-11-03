import { expect, waitFor } from "storybook/test";

import preview from "#storybook/preview";

import { CopyAddressButton } from "./CopyAddressButton";

const meta = preview.meta({
	title: "Patterns/CopyAddressButton",
	component: CopyAddressButton,
	tags: ["autodocs"],
	args: { address: "adit.shah@kybernetic.systems" },
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement, userEvent }) => {
		await userEvent.click(canvas.getByRole("button", { name: "Copy address" }));
		// Clipboard access depends on the browser's permissions; either outcome is announced.
		await waitFor(() =>
			expect(canvasElement.querySelector("output")?.textContent).toMatch(
				/Address copied|Couldn't copy/u,
			),
		);
	},
});
