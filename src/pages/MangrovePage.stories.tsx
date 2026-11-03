import { mangrovePage, site } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { ProductFrame } from "#/stories/ProductFrame";
import preview from "#storybook/preview";

import { MangrovePage } from "./MangrovePage";

const meta = preview.meta({
	title: "Pages/Mangrove",
	component: MangrovePage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/mangrove" } } } },
	args: { page: mangrovePage, site },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<ProductFrame>
			<MangrovePage {...args} />
		</ProductFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvasElement }) => {
		await expectWellFormedPage(canvasElement);
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
