import path from "node:path";
import { fileURLToPath } from "node:url";

import babel from "@rolldown/plugin-babel";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

import { contentCollections } from "./vite-plugins/content-collections";
import { favicons } from "./vite-plugins/favicons";

const dirname =
	typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	server: {
		port: 3000,
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		devtools(),
		tailwindcss(),
		contentCollections(),
		imagetools(),
		// `?react` imports an SVG as a component; the file itself stays the single source of the mark.
		// `dimensions: false` strips its `width` and `height` attributes, which would otherwise pin the
		// rendered size: a width-only class like the hero's `w-mark` widens the box while the height
		// attribute holds the artwork at 185px.
		svgr({ svgrOptions: { dimensions: false } }),
		// Raster favicons and the web app manifest, generated from the mark.
		favicons({
			mark: path.join(dirname, "src/components/primitives/Logo/mark.svg"),
			site: path.join(dirname, "content/singletons/site.toml"),
			theme: path.join(dirname, "src/styles/theme.css"),
		}),
		tanstackStart({
			// Every page is prerendered by following links from the home page. Route discovery is off
			// because it adds trailing-slash duplicates (/blog/) of index routes.
			prerender: {
				enabled: true,
				crawlLinks: true,
				failOnError: true,
				autoStaticPathsDiscovery: false,
			},
			sitemap: { enabled: true, host: "https://kybernetic.systems" },
			pages: [
				{ path: "/" },
				{ path: "/blog/rss.xml", sitemap: { exclude: true } },
				// Served at mangrove.kybernetic.systems, so no link from this site points at it and
				// it does not belong in this host's sitemap.
				{ path: "/mangrove", sitemap: { exclude: true } },
				// `autoSubfolderIndex: false` writes `404.html` beside the pages instead of
				// `404/index.html`, which is where Cloudflare looks for a host's not-found page.
				{ path: "/404", sitemap: { exclude: true }, prerender: { autoSubfolderIndex: false } },
				{
					path: "/mangrove/404",
					sitemap: { exclude: true },
					prerender: { autoSubfolderIndex: false },
				},
			],
		}),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	fmt: {
		ignorePatterns: ["**/routeTree.gen.ts"],
		sortPackageJson: {
			sortScripts: true,
		},
		sortTailwindcss: { stylesheet: "./src/global.css", functions: ["tv", "cn"] },
		sortImports: {},
		quoteProps: "consistent",
	},
	lint: {
		options: {
			typeAware: true,
			typeCheck: true,
		},
		plugins: [
			"eslint",
			"typescript",
			"unicorn",
			"react",
			"oxc",
			"import",
			"jsdoc",
			"jsx-a11y",
			"node",
			"promise",
			"vitest",
		],
		jsPlugins: ["eslint-plugin-storybook"],
		categories: {
			correctness: "error",
			suspicious: "error",
			perf: "error",
		},
		rules: {
			"import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
			"react/react-in-jsx-scope": "off",
		},
	},
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					include: ["src/**/*.test.ts", "scripts/**/*.test.ts", "vite-plugins/**/*.test.ts"],
					environment: "node",
				},
			},
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({ configDir: path.join(dirname, ".storybook") }),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						// Every story runs at a desktop width and at 320px, the WCAG reflow minimum.
						instances: [
							{ browser: "chromium", name: "desktop", viewport: { width: 1280, height: 900 } },
							{ browser: "chromium", name: "mobile", viewport: { width: 320, height: 640 } },
						],
					},
				},
			},
		],
	},
});
