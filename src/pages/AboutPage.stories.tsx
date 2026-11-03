import { expect } from "storybook/test";

import { aboutPage, people } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { AboutPage } from "./AboutPage";

const meta = preview.meta({
	title: "Pages/About",
	component: AboutPage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/about" } } } },
	args: { page: aboutPage, people },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<AboutPage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvas, canvasElement }) => {
		await expectWellFormedPage(canvasElement);
		await expect(canvas.getByRole("heading", { level: 3, name: "Adit Shah" })).toBeVisible();
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
