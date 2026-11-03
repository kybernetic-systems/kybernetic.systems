/*
 * The default social card. Written with `createElement` rather than JSX so Node can run it directly
 * (type stripping doesn't cover JSX). Styles follow Satori's subset of CSS: flexbox layout only.
 */
import { createElement as h } from "react";
import type { ReactElement } from "react";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const navy = "#0a1a3a";
const paper = "#f7f4ed";
const brass = "#a37e44";
const mono = '"IBM Plex Mono", monospace';
const serif = '"EB Garamond", "EB Garamond Variable", Garamond, serif';

export type OgTemplateProps = {
	/** Data URI of the mark. */
	logoSrc: string;
	titleLines: string[];
	domain: string;
};

export function OgTemplate({ logoSrc, titleLines, domain }: OgTemplateProps): ReactElement {
	return h(
		"div",
		{
			style: {
				width: OG_WIDTH,
				height: OG_HEIGHT,
				display: "flex",
				position: "relative",
				overflow: "hidden",
				backgroundColor: navy,
				color: paper,
				padding: "80px 88px",
			},
		},
		h("img", {
			src: logoSrc,
			alt: "",
			width: 380,
			height: 380,
			// Fully inside the card: a mark cropped by the edge reads as a mistake, not as a bleed.
			style: { position: "absolute", right: 88, top: (OG_HEIGHT - 380) / 2, opacity: 0.95 },
		}),
		h(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: "100%",
				},
			},
			h(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						fontFamily: mono,
						fontSize: 20,
						letterSpacing: "0.22em",
					},
				},
				h("span", { style: { color: paper } }, "KYBERNETIC"),
				h("span", { style: { color: brass, marginTop: 6 } }, "SYSTEMS"),
			),
			h(
				"div",
				{ style: { display: "flex", flexDirection: "column" } },
				...titleLines.map((line) =>
					h(
						"span",
						{
							key: line,
							style: {
								fontFamily: serif,
								fontSize: 88,
								lineHeight: 1.04,
								letterSpacing: "-0.015em",
							},
						},
						line,
					),
				),
				h("div", { style: { width: 96, height: 2, backgroundColor: brass, marginTop: 40 } }),
			),
			h(
				"span",
				{ style: { fontFamily: mono, fontSize: 20, letterSpacing: "0.16em", color: brass } },
				domain,
			),
		),
	);
}
