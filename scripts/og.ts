import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Renders the default social card to `public/og/default.png`. Run with `vp run og` after changing
 * the template or the motto, and commit the image.
 */
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { parse } from "smol-toml";

import { homeSchema, siteSchema } from "#/content/schema.ts";

import { OG_HEIGHT, OG_WIDTH, OgTemplate } from "./og-template.ts";

const root = path.resolve(import.meta.dirname, "..");
const fromRoot = (...segments: string[]) => path.join(root, ...segments);

const [home, site, mark, serif, mono, monoMedium] = await Promise.all([
	readFile(fromRoot("content/singletons/home.toml"), "utf8").then((text) =>
		homeSchema.parse(parse(text)),
	),
	readFile(fromRoot("content/singletons/site.toml"), "utf8").then((text) =>
		siteSchema.parse(parse(text)),
	),
	readFile(fromRoot("src/components/primitives/Logo/mark.svg")),
	readFile(
		fromRoot("node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff"),
	),
	readFile(
		fromRoot("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff"),
	),
	readFile(
		fromRoot("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff"),
	),
]);

const svg = await satori(
	OgTemplate({
		logoSrc: `data:image/svg+xml;base64,${mark.toString("base64")}`,
		titleLines: home.hero.titleLines,
		domain: new URL(site.url).host,
	}),
	{
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fonts: [
			{ name: "EB Garamond", data: serif, weight: 400, style: "normal" },
			{ name: "IBM Plex Mono", data: mono, weight: 400, style: "normal" },
			{ name: "IBM Plex Mono", data: monoMedium, weight: 500, style: "normal" },
		],
	},
);

const png = new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } }).render().asPng();
const output = fromRoot("public/og/default.png");
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, png);
console.log(
	`Wrote ${path.relative(root, output)} (${OG_WIDTH}×${OG_HEIGHT}, ${Math.round(png.length / 1024)} KB)`,
);
