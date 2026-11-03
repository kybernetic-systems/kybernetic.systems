import { contactPage, site } from "#/content/fixtures";
import { expectWellFormedPage } from "#/stories/page-checks";
import { PageFrame } from "#/stories/PageFrame";
import preview from "#storybook/preview";

import { ContactPage } from "./ContactPage";

const meta = preview.meta({
	title: "Pages/Contact",
	component: ContactPage,
	parameters: { layout: "fullscreen", tanstack: { router: { route: { path: "/contact" } } } },
	args: { page: contactPage, site },
	// The shell renders inside the story so its links are inside the Storybook router.
	render: (args) => (
		<PageFrame>
			<ContactPage {...args} />
		</PageFrame>
	),
});

export const Default = meta.story({
	play: async ({ canvasElement }) => {
		await expectWellFormedPage(canvasElement);
	},
});

export const Mobile = meta.story({ globals: { viewport: { value: "mobile" } } });
