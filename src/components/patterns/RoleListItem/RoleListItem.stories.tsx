import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { careersPage, openRole, roles, roleSummary } from "#/content/fixtures";
import preview from "#storybook/preview";

import { RoleListItem } from "./RoleListItem";

const meta = preview.meta({
	title: "Patterns/RoleListItem",
	component: RoleListItem,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { role: roleSummary, readLabel: careersPage.roles.readLabel },
	decorators: [
		(Story) => (
			<Container className="py-12">
				<Story />
			</Container>
		),
	],
});

export const OpeningSoon = meta.story({
	args: { role: { ...roleSummary, status: "opening-soon" } },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("link", { name: roleSummary.title })).toHaveAttribute(
			"href",
			`/careers/${roleSummary.slug}`,
		);
		await expect(
			canvas.getByRole("link", {
				name: new RegExp(`^Read the role\\s+for ${roleSummary.title}$`, "u"),
			}),
		).toBeVisible();
		await expect(canvas.getByText("Opening soon")).toBeVisible();
	},
});

export const Open = meta.story({ args: { role: openRole } });

export const AllStatuses = meta.story({
	render: (args) => (
		<>
			{roles.map((role) => (
				<RoleListItem key={role.slug} role={role} readLabel={args.readLabel} />
			))}
		</>
	),
});
