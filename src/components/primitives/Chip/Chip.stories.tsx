import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Chip } from "./Chip";

const meta = preview.meta({
	title: "Primitives/Chip",
	component: Chip,
	tags: ["autodocs"],
	args: { children: "Full-time" },
});

export const Default = meta.story({});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
				<li>
					<Chip>Full-time</Chip>
				</li>
				<li>
					<Chip>Product engineering</Chip>
				</li>
				<li>
					<Chip>Meaningful equity</Chip>
				</li>
			</ul>
		</ToneMatrix>
	),
});
