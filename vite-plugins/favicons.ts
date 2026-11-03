/**
 * Generates the raster favicons and the web app manifest from the mark, so `mark.svg` stays the only
 * copy of the artwork. Files are served from memory by `vp dev` and emitted at the site root by
 * `vp build`; nothing generated is committed.
 */
import { readFile } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";

import {
	generateFaviconFiles,
	IconTransformationType,
	initFaviconIconSettings,
	stringToSvg,
} from "@realfavicongenerator/generate-favicon";
import type { FaviconSettings } from "@realfavicongenerator/generate-favicon";
import { getNodeImageAdapter } from "@realfavicongenerator/image-adapter-node";
import { parse } from "smol-toml";
import type { Plugin } from "vite";

import { siteSchema } from "#/content/schema";

export type FaviconSources = {
	/** The mark: `src/components/primitives/Logo/mark.svg`. */
	mark: string;
	/** Supplies the app name: `content/singletons/site.toml`. */
	site: string;
	/** Supplies the brand colours: `src/styles/theme.css`. */
	theme: string;
};

/** Everything emitted at the site root. The generator's `favicon.svg` is left out: pages link the mark itself. */
export const faviconFileNames = [
	"favicon.ico",
	"favicon-96x96.png",
	"apple-touch-icon.png",
	"web-app-manifest-192x192.png",
	"web-app-manifest-512x512.png",
	"site.webmanifest",
] as const;

type IconTransformation = FaviconSettings["icon"]["touch"]["transformation"];

const servedNames: ReadonlySet<string> = new Set(faviconFileNames);

const contentTypes: Record<string, string> = {
	".ico": "image/x-icon",
	".png": "image/png",
	".webmanifest": "application/manifest+json",
};

function themeColor(css: string, name: string): string {
	const match = new RegExp(`--color-${name}:\\s*(#[\\da-f]{6})`, "iu").exec(css);
	if (!match?.[1]) {
		throw new Error(`Couldn't find --color-${name} in the theme`);
	}
	return match[1];
}

function onBackground(backgroundColor: string, imageScale: number): IconTransformation {
	return {
		type: IconTransformationType.Background,
		backgroundColor,
		backgroundRadius: 0,
		imageScale,
		brightness: 1,
	};
}

async function toBuffer(content: string | Buffer | Blob): Promise<Buffer> {
	if (typeof content === "string") return Buffer.from(content);
	if (Buffer.isBuffer(content)) return content;
	return Buffer.from(await content.arrayBuffer());
}

/** Renders every favicon file from the sources. */
export async function generateFavicons(sources: FaviconSources): Promise<Map<string, Buffer>> {
	const [mark, siteToml, themeCss] = await Promise.all([
		readFile(sources.mark, "utf8"),
		readFile(sources.site, "utf8"),
		readFile(sources.theme, "utf8"),
	]);
	const site = siteSchema.parse(parse(siteToml));
	const navy = themeColor(themeCss, "navy");
	const brass = themeColor(themeCss, "brass");

	const defaults = initFaviconIconSettings();
	const settings: FaviconSettings = {
		path: "/",
		skipMetadataInjection: true,
		icon: {
			// Browser tabs: the brass mark on a transparent background, as the SVG favicon shows it.
			desktop: defaults.desktop,
			// iOS only rounds the corners, so the mark can fill 80% of the square.
			touch: { ...defaults.touch, transformation: onBackground(navy, 0.8) },
			// Maskable icons can be cropped to the middle 80% circle; 0.75 keeps the wheel's handles inside.
			webAppManifest: {
				...defaults.webAppManifest,
				transformation: onBackground(navy, 0.75),
				name: site.shortName,
				shortName: site.shortName,
				backgroundColor: navy,
				themeColor: brass,
			},
		},
	};

	const adapter = await getNodeImageAdapter();
	const files = await generateFaviconFiles({ icon: stringToSvg(mark, adapter) }, settings, adapter);

	return new Map(
		await Promise.all(
			faviconFileNames.map(async (name): Promise<[string, Buffer]> => {
				const content = files[name];
				if (content === undefined) {
					throw new Error(`The favicon generator didn't produce ${name}`);
				}
				return [name, await toBuffer(content)];
			}),
		),
	);
}

export function favicons(sources: FaviconSources): Plugin {
	const watched = new Set(Object.values(sources).map((file) => path.resolve(file)));
	let generated: Promise<Map<string, Buffer>> | undefined;
	const load = () => (generated ??= generateFavicons(sources));

	async function serve(
		request: IncomingMessage,
		response: ServerResponse,
		next: (error?: unknown) => void,
	) {
		const name = request.url?.split(/[?#]/u)[0]?.slice(1) ?? "";
		if (!servedNames.has(name)) {
			next();
			return;
		}
		try {
			const body = (await load()).get(name);
			response.setHeader(
				"Content-Type",
				contentTypes[path.extname(name)] ?? "application/octet-stream",
			);
			response.setHeader("Cache-Control", "no-cache");
			response.end(body);
		} catch (error) {
			next(error);
		}
	}

	return {
		name: "kybernetic:favicons",
		configureServer(server) {
			server.watcher.add([...watched]);
			server.watcher.on("change", (file) => {
				if (watched.has(path.resolve(file))) generated = undefined;
			});
			server.middlewares.use((request, response, next) => {
				void serve(request, response, next);
			});
		},
		async generateBundle() {
			// Start builds a client and a server bundle; the files belong with the client's static assets.
			if (this.environment.name !== "client") return;
			for (const [fileName, source] of await load()) {
				this.emitFile({ type: "asset", fileName, source });
			}
		},
	};
}
