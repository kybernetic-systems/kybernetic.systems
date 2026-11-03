import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Lists content that still holds placeholder copy or awaits counsel review.
 * Run with `vp run content:status`. Informational only: always exits 0.
 */
import { createBuilder } from "@content-collections/core";

import { pendingContent } from "#/content/status.ts";

const root = path.resolve(import.meta.dirname, "..");
const builder = await createBuilder(path.join(root, "vite-plugins/content-collections.config.ts"));
await builder.build();

const generated = (name: string) =>
	pathToFileURL(path.join(root, "vite-plugins/.content-collections/generated", `${name}.js`)).href;

const [{ default: roles }, { default: people }, { default: legal }] = await Promise.all([
	import(generated("allRoles")),
	import(generated("allPeople")),
	import(generated("allLegals")),
]);

const pending = pendingContent({ roles, people, legal });

if (pending.length === 0) {
	console.log("No placeholder or pending content.");
} else {
	const width = Math.max(...pending.map((item) => item.file.length));
	console.log(`${pending.length} item${pending.length === 1 ? "" : "s"} still pending:\n`);
	for (const item of pending) {
		console.log(`  ${item.file.padEnd(width)}  ${item.reason}`);
	}
}
