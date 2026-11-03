import path from "node:path";

import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vite-plus/test";

import { faviconFileNames, generateFavicons } from "./favicons";

const root = path.resolve(import.meta.dirname, "..");

const navy = [10, 26, 58];
const brass = [163, 126, 68];

let files: Map<string, Buffer>;

beforeAll(async () => {
	files = await generateFavicons({
		mark: path.join(root, "src/components/primitives/Logo/mark.svg"),
		site: path.join(root, "content/singletons/site.toml"),
		theme: path.join(root, "src/styles/theme.css"),
	});
}, 60_000);

function file(name: string): Buffer {
	const content = files.get(name);
	if (!content) throw new Error(`${name} wasn't generated`);
	return content;
}

/** The RGBA pixel at a fraction of the way across and down an image. */
async function pixelAt(name: string, x: number, y: number): Promise<number[]> {
	const { data, info } = await sharp(file(name))
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const offset =
		(Math.floor(y * (info.height - 1)) * info.width + Math.floor(x * (info.width - 1))) * 4;
	return [...data.subarray(offset, offset + 4)];
}

/** The largest per-channel difference between two RGBA colours; anti-aliasing stays within a few units. */
function colourDistance(actual: number[], expected: number[]): number {
	return Math.max(...expected.map((channel, index) => Math.abs((actual[index] ?? -255) - channel)));
}

describe("generateFavicons", () => {
	it("produces exactly the root icon files", () => {
		expect([...files.keys()]).toEqual([...faviconFileNames]);
	});

	it.each([
		["favicon-96x96.png", 96],
		["apple-touch-icon.png", 180],
		["web-app-manifest-192x192.png", 192],
		["web-app-manifest-512x512.png", 512],
	])("renders %s at %ipx", async (name, size) => {
		const { format, width, height } = await sharp(file(name)).metadata();
		expect({ format, width, height }).toEqual({ format: "png", width: size, height: size });
	});

	it("packs 48, 32 and 16px images into the ICO", () => {
		const ico = file("favicon.ico");
		expect([...ico.subarray(0, 6)]).toEqual([0, 0, 1, 0, 3, 0]);
		expect([ico[6], ico[22], ico[38]]).toEqual([48, 32, 16]);
	});

	it("paints the mark brass from its default colour, on transparency for browser tabs", async () => {
		// The mark's hub sits at the exact center.
		expect(
			colourDistance(await pixelAt("favicon-96x96.png", 0.5, 0.5), [...brass, 255]),
		).toBeLessThanOrEqual(6);
		expect((await pixelAt("favicon-96x96.png", 0, 0))[3]).toBe(0);
	});

	it.each(["apple-touch-icon.png", "web-app-manifest-192x192.png", "web-app-manifest-512x512.png"])(
		"puts the brass mark on navy in %s",
		async (name) => {
			expect(colourDistance(await pixelAt(name, 0.5, 0.5), [...brass, 255])).toBeLessThanOrEqual(6);
			expect(colourDistance(await pixelAt(name, 0, 0), [...navy, 255])).toBeLessThanOrEqual(6);
		},
	);

	it("writes the manifest from the site's name and theme colours", () => {
		expect(JSON.parse(file("site.webmanifest").toString())).toEqual({
			name: "Kybernetic Systems",
			short_name: "Kybernetic Systems",
			icons: [
				{
					src: "/web-app-manifest-192x192.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "maskable",
				},
				{
					src: "/web-app-manifest-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable",
				},
			],
			theme_color: "#a37e44",
			background_color: "#0a1a3a",
			display: "standalone",
		});
	});
});
