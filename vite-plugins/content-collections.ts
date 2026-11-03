/**
 * Compiles `content/` into typed, bundled modules through Content Collections. The collections
 * themselves are defined in `content-collections.config.ts` beside this file; that file's location
 * is what makes the collection paths and the generated output directory resolve.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { type Builder, createBuilder } from "@content-collections/core";
import contentCollectionsPlugin from "@content-collections/vite";
import type { Plugin } from "vite-plus";

const dirname =
	typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/** Passed to the plugin as a path from the project root, and to the builder as an absolute one. */
const configFile = "vite-plugins/content-collections.config.ts";
const configPath = path.join(dirname, path.basename(configFile));

type Watcher = Awaited<ReturnType<Builder["watch"]>>;

interface Content {
	builder: Promise<Builder>;
	/** Files Content Collections rejected during the build, collected for `strict()` to report. */
	failures: string[];
}

/**
 * One builder for the whole process, shared by every resolved Vite config. A plugin builds once per
 * resolution, and `vp test` resolves this config four times — Vitest's own server, the `unit`
 * project, the `storybook` project, and the browser server the stories run in — which built the
 * same content four times over. Each resolution re-evaluates this module, so the cache has to live
 * on `globalThis`; whichever config reaches it first builds, and the rest await the same promise.
 */
const slot = Symbol.for("kybernetic.content-collections");

type Cache = typeof globalThis & { [slot]?: Content };

function content(): Content {
	const cache = globalThis as Cache;
	return (cache[slot] ??= create());
}

function create(): Content {
	const failures: string[] = [];
	return { builder: start(failures), failures };
}

async function start(failures: string[]): Promise<Builder> {
	const builder = await createBuilder(configPath);
	for (const event of [
		"collector:read-error",
		"collector:parse-error",
		"transformer:validation-error",
		"transformer:result-error",
		"transformer:error",
	] as const) {
		builder.on(event, (details) => failures.push(`${event}: ${JSON.stringify(details)}`));
	}
	builder.on("builder:end", ({ startedAt, endedAt, stats }) => {
		const { collections, documents } = stats;
		const summary = `${collections} collections and ${documents} documents`;
		console.log(`content-collections: built ${summary} in ${endedAt - startedAt}ms`);
	});
	await builder.build();
	return builder;
}

/**
 * Upstream supplies `config()` — the `content-collections` alias and the dependency-optimizer
 * exclusion — and nothing else: `isEnabled` false leaves it without a builder, so its `buildStart`
 * and `configureServer` stand down and the hooks below take their place.
 */
function build(): Plugin {
	const plugin = contentCollectionsPlugin({ configPath: configFile, isEnabled: () => false });
	let watcher: Watcher | undefined;
	return {
		...plugin,
		async buildStart() {
			await content().builder;
		},
		async configureServer() {
			/*
			 * Vitest runs a dev server too, and a watcher there holds the process open until Vitest's
			 * ten-second close timeout: https://github.com/sdorra/content-collections/issues/806. Tests
			 * have no use for one, since nothing edits content mid-run.
			 */
			if (process.env["VITEST"] || watcher) return;
			watcher = await (await content().builder).watch();
		},
		async closeBundle() {
			// Unlike upstream, which drops the handle, the watcher is torn down with the server.
			await watcher?.unsubscribe();
			watcher = undefined;
		},
	};
}

/**
 * Content Collections logs invalid files and leaves them out, which is right while editing but would
 * let a production build ship without a page. `vp build` fails instead.
 */
function strict(): Plugin {
	return {
		name: "kybernetic:strict-content",
		apply: "build",
		async buildStart() {
			const { builder, failures } = content();
			await builder;
			if (failures.length > 0) {
				this.error(`Content has errors; fix them before building:\n${failures.join("\n")}`);
			}
		},
	};
}

export function contentCollections(): Plugin[] {
	return [build(), strict()];
}
