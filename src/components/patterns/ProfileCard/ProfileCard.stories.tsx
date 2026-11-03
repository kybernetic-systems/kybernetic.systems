import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { person } from "#/content/fixtures";
import preview from "#storybook/preview";

import { ProfileCard } from "./ProfileCard";

const meta = preview.meta({
	title: "Patterns/ProfileCard",
	component: ProfileCard,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { person },
	decorators: [
		(Story) => (
			<Container className="py-12">
				<Story />
			</Container>
		),
	],
});

export const PlaceholderBio = meta.story({
	args: { person: { ...person, bioStatus: "placeholder" } },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("img", { name: person.portrait.alt })).toBeVisible();
		await expect(canvas.getByRole("note")).toHaveTextContent("Placeholder bio");
	},
});

export const FinalBio = meta.story({
	args: { person: { ...person, bioStatus: "final" } },
	play: async ({ canvas }) => {
		await expect(canvas.queryByRole("note")).not.toBeInTheDocument();
	},
});
