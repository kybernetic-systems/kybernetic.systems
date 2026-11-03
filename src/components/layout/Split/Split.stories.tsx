import { Prose } from "#/components/content/Prose/Prose";
import { Container } from "#/components/layout/Container/Container";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { homePage } from "#/content/fixtures";
import preview from "#storybook/preview";

import { Split } from "./Split";

const meta = preview.meta({
	title: "Layout/Split",
	component: Split,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { aside: null, children: null },
});

export const Default = meta.story({
	render: () => (
		<Container className="py-12">
			<Split aside={<Eyebrow as="h2">The Name</Eyebrow>}>
				<Prose content={homePage.name.body} className="max-w-measure-lg" />
			</Split>
		</Container>
	),
});
