import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { careersPage, post, role } from "#/content/fixtures";
import preview from "#storybook/preview";

import { Prose } from "./Prose";

const meta = preview.meta({
	title: "Content/Prose",
	component: Prose,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { content: post.body },
	decorators: [
		(Story) => (
			<Container size="article" className="py-12">
				<Story />
			</Container>
		),
	],
});

export const Article = meta.story({
	play: async ({ canvasElement }) => {
		await expect(canvasElement.querySelector("blockquote")).toBeInTheDocument();
		await expect(canvasElement.querySelector("h2")).toHaveAttribute("id");
	},
});

export const RoleDescription = meta.story({
	args: { content: role.body },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("heading", { level: 2, name: "What you'll do" })).toBeVisible();
		await expect(canvas.getAllByRole("list").length).toBeGreaterThan(0);
	},
});

export const Muted = meta.story({
	args: { content: careersPage.honesty.body, size: "body", tone: "muted" },
});
