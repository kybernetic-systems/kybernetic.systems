import { expect } from "storybook/test";

import { privacy, terms } from "#/content/fixtures";
import preview from "#storybook/preview";

import { LegalDocument } from "./LegalDocument";

const meta = preview.meta({
	title: "Patterns/LegalDocument",
	component: LegalDocument,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { document: privacy },
});

export const PrivacyWithContents = meta.story({
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Privacy Policy");
		await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(
			privacy.sections.length,
		);
		await expect(canvas.getByRole("note")).toHaveTextContent("Pending counsel review");
		await expect(canvas.queryByText(/Have Indian counsel review/u)).not.toBeInTheDocument();
	},
});

export const TermsWithNote = meta.story({
	args: { document: terms },
	play: async ({ canvas }) => {
		await expect(canvas.getByText(/These terms cover this website only/u)).toBeVisible();
	},
});

export const Reviewed = meta.story({
	args: { document: { ...privacy, review: { status: "reviewed", reviewedBy: "Counsel" } } },
	play: async ({ canvas }) => {
		await expect(canvas.queryByRole("note")).not.toBeInTheDocument();
	},
});
