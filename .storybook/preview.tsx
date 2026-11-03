import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import { definePreview } from "@storybook/tanstack-react";
import { useEffect } from "react";

import "#/global.css";

type Tone = "paper" | "ink";

const viewports = {
	"mobile-s": {
		name: "Mobile S (320)",
		styles: { width: "320px", height: "640px" },
		type: "mobile",
	},
	"mobile": { name: "Mobile (390)", styles: { width: "390px", height: "844px" }, type: "mobile" },
	"tablet": { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
	"laptop": {
		name: "Laptop (1024)",
		styles: { width: "1024px", height: "768px" },
		type: "desktop",
	},
	"desktop": {
		name: "Desktop (1280)",
		styles: { width: "1280px", height: "900px" },
		type: "desktop",
	},
	"wide": { name: "Wide (1440)", styles: { width: "1440px", height: "960px" }, type: "desktop" },
} as const;

function ReducedMotion({ reduced }: { reduced: boolean }) {
	useEffect(() => {
		const root = document.documentElement;
		if (reduced) {
			root.dataset["reducedMotion"] = "";
		} else {
			delete root.dataset["reducedMotion"];
		}
	}, [reduced]);
	return null;
}

export default definePreview({
	addons: [addonDocs(), addonA11y()],
	parameters: {
		a11y: { test: "error" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		viewport: { options: viewports },
	},
	globalTypes: {
		tone: {
			description: "Surface tone the story renders on",
			toolbar: {
				title: "Tone",
				icon: "contrast",
				items: [
					{ value: "paper", title: "Paper" },
					{ value: "ink", title: "Ink" },
				],
				dynamicTitle: true,
			},
		},
		motion: {
			description: "Preview the reduced-motion state",
			toolbar: {
				title: "Motion",
				icon: "play",
				items: [
					{ value: "full", title: "Full motion" },
					{ value: "reduced", title: "Reduced motion" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		tone: "paper",
		motion: "full",
	},
	decorators: [
		(Story, { globals, parameters }) => {
			const tone: Tone = globals["tone"] === "ink" ? "ink" : "paper";
			const padded = parameters["layout"] !== "fullscreen";
			return (
				<div data-tone={tone} className={padded ? "min-h-dvh p-6" : "min-h-dvh"}>
					<ReducedMotion reduced={globals["motion"] === "reduced"} />
					<Story />
				</div>
			);
		},
	],
});
