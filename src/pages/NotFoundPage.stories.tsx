import { expect } from "storybook/test";

import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { NotFoundPage } from "./NotFoundPage";

const meta = preview.meta({
	title: "Pages/NotFound",
	component: NotFoundPage,
	parameters: { layout: "fullscreen" },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<NotFoundPage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(canvas.getByRole("link", { name: "Back to the home page" })).toHaveAttribute(
			"href",
			"/",
		);
	},
});
