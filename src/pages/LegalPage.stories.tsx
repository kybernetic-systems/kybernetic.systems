import { privacy, terms } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { LegalPage } from "./LegalPage";

const meta = preview.meta({
	title: "Pages/Legal",
	component: LegalPage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/privacy" } } } },
	args: { document: privacy },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<LegalPage {...args} />
		</PageFrame>
	),
});

export const Privacy = meta.story({
	play: async ({ canvasElement }) => {
		await expectWellFormedPage(canvasElement);
	},
});

export const Terms = meta.story({
	args: { document: terms },
	parameters: { tanstack: { router: { route: { path: "/terms" } } } },
	play: async ({ canvasElement }) => {
		await expectWellFormedPage(canvasElement);
	},
});
