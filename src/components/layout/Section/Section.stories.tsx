import { expect } from "storybook/test";

import { Container } from "#/components/layout/Container/Container";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Text } from "#/components/primitives/Text/Text";
import preview from "#storybook/preview";

import { Section } from "./Section";

const meta = preview.meta({
	title: "Layout/Section",
	component: Section,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { children: null },
});

export const Tones = meta.story({
	render: () => (
		<>
			<Section labelledBy="paper-section" divider>
				<Container>
					<Eyebrow as="h2" id="paper-section" className="mb-4">
						Paper
					</Eyebrow>
					<Text size="body-lg">Default tone, with a divider below.</Text>
				</Container>
			</Section>
			<Section tone="ink" labelledBy="ink-section">
				<Container>
					<Eyebrow as="h2" id="ink-section" className="mb-4">
						Ink
					</Eyebrow>
					<Text size="body-lg">Everything inside re-themes from the tone.</Text>
				</Container>
			</Section>
		</>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("region", { name: "Ink" })).toHaveAttribute("data-tone", "ink");
	},
});
