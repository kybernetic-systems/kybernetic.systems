import { expect } from "storybook/test";

import { careersPage, closedRole, role } from "#/content/fixtures";
import preview from "#storybook/preview";

import { RoleHeader } from "./RoleHeader";

const meta = preview.meta({
	title: "Patterns/RoleHeader",
	component: RoleHeader,
	tags: ["autodocs"],
	args: {
		role,
		defaultLocation: careersPage.roles.location,
		backLabel: careersPage.rolePage.backLabel,
	},
});

export const Default = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(role.title);
		await expect(canvas.getByText(/Mumbai · in person/u)).toBeVisible();
	},
});

export const Closed = meta.story({ args: { role: closedRole } });

export const WithCompensation = meta.story({
	args: { role: { ...role, compensation: "₹24–32 LPA + equity" } },
});
