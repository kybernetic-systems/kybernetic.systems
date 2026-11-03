import preview from "#storybook/preview";

import { Container } from "./Container";

const meta = preview.meta({
	title: "Layout/Container",
	component: Container,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	args: { children: "Content" },
});

export const Sizes = meta.story({
	render: () => (
		<div className="grid gap-4 py-6">
			{(["page", "statement", "article", "narrow"] as const).map((size) => (
				<Container key={size} size={size}>
					<p className="m-0 bg-tint p-4 font-mono text-mono-sm">{size}</p>
				</Container>
			))}
		</div>
	),
});
