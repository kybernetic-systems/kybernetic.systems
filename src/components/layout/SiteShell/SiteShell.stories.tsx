import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { Heading } from "#/components/primitives/Heading/Heading";
import { site } from "#/content/fixtures";
import preview from "#storybook/preview";

import { SiteShell } from "./SiteShell";

const meta = preview.meta({
	title: "Layout/SiteShell",
	component: SiteShell,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { site, grievanceOfficer: "Adit Shah", year: 2026, children: null },
});

export const Default = meta.story({
	render: (args) => (
		<SiteShell {...args}>
			<Container className="py-section">
				<Heading level={1} size="display">
					Page content
				</Heading>
			</Container>
		</SiteShell>
	),
	play: async ({ canvas, userEvent }) => {
		await expect(canvas.getByRole("banner")).toBeInTheDocument();
		await expect(canvas.getByRole("main")).toBeInTheDocument();
		await expect(canvas.getByRole("contentinfo")).toBeInTheDocument();
		await userEvent.tab();
		await expect(canvas.getByRole("link", { name: "Skip to content" })).toHaveFocus();
	},
});
