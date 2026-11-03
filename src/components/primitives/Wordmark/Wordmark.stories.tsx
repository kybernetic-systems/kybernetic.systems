import { ToneMatrix } from "#/stories/ToneMatrix";
import preview from "#storybook/preview";

import { Wordmark } from "./Wordmark";

const meta = preview.meta({
	title: "Primitives/Wordmark",
	component: Wordmark,
	tags: ["autodocs"],
});

export const Default = meta.story({});

export const Matrix = meta.story({
	parameters: { layout: "fullscreen" },
	render: () => (
		<ToneMatrix>
			<Wordmark />
		</ToneMatrix>
	),
});
