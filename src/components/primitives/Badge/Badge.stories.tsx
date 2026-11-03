import { Chip } from "#/components/primitives/Chip/Chip";
import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Badge } from "./Badge";

const meta = preview.meta({
	title: "Primitives/Badge",
	component: Badge,
	tags: ["autodocs"],
	args: { children: "Opening soon" },
});

export const Default = meta.story({});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix className="justify-items-start">
			<Badge>Open</Badge>
			<Badge>Opening soon</Badge>
			<Badge>Rolling</Badge>
			<Badge>Closed</Badge>
			<Chip>Full-time</Chip>
		</ToneMatrix>
	),
});
