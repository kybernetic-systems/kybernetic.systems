import { expect } from "storybook/test";

import { careersPage, site } from "#/content/fixtures";
import { mailto } from "#/lib/mailto";
import preview from "#storybook/preview";

import { CalloutPanel } from "./CalloutPanel";

const meta = preview.meta({
	title: "Patterns/CalloutPanel",
	component: CalloutPanel,
	tags: ["autodocs"],
	args: {
		title: careersPage.openApplication.title,
		body: careersPage.openApplication.body,
		action: {
			label: careersPage.openApplication.ctaLabel,
			href: mailto({ to: site.email, subject: site.mailto.openApplication.subject }),
		},
	},
});

export const OpenApplication = meta.story({
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("region", { name: "Nothing here fits you?" }),
		).toBeInTheDocument();
		await expect(
			canvas.getByRole("link", { name: "Write to us (opens your email app)" }),
		).toHaveAttribute("href", "mailto:adit.shah@kybernetic.systems?subject=Open%20application");
	},
});

export const Narrow = meta.story({
	decorators: [
		(Story) => (
			<div className="max-w-sm">
				<Story />
			</div>
		),
	],
});
