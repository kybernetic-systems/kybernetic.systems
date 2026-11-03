import { expect, waitFor } from "storybook/test";

import markSvg from "#/components/primitives/Logo/mark.svg?raw";
import { homePage, site } from "#/content/fixtures";
import { OG_HEIGHT, OG_WIDTH, OgTemplate } from "#scripts/og-template.ts";
import preview from "#storybook/preview";

const meta = preview.meta({
	title: "Foundations/OG Image",
	component: OgTemplate,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"The default social card. Edit `scripts/og-template.ts`, check it here, then run `vp run og` to regenerate `public/og/default.png`.",
			},
		},
	},
	args: {
		/*
		 * Inlined rather than linked: a URL that works in dev fails under the Vitest browser server or
		 * in a built Storybook. `scripts/og.ts` inlines this same file when rendering the real image.
		 */
		logoSrc: `data:image/svg+xml;utf8,${encodeURIComponent(markSvg)}`,
		titleLines: homePage.hero.titleLines,
		domain: new URL(site.url).host,
	},
});

export const Default = meta.story({
	// A 1200×630 image, not a page: it's inspected at its real size and scrolls sideways when narrow.
	render: (args) => (
		// oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable regions must be keyboard reachable
		<section aria-label="Social card preview" tabIndex={0} className="overflow-x-auto">
			<OgTemplate {...args} />
		</section>
	),
	play: async ({ canvasElement }) => {
		const logo = canvasElement.querySelector("img");
		const card = logo?.parentElement;
		await expect(card?.getBoundingClientRect().width).toBe(OG_WIDTH);
		await expect(card?.getBoundingClientRect().height).toBe(OG_HEIGHT);
		// The card is judged by eye here, so a logo that fails to load has to fail the test.
		await waitFor(() => expect(logo?.complete).toBe(true));
		await expect(logo?.naturalWidth, `logo failed to load from ${logo?.src}`).toBeGreaterThan(0);
	},
});
