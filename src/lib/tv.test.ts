import { describe, expect, it } from "vite-plus/test";

import { cn } from "./tv";

describe("cn", () => {
	it("keeps a theme text size and a theme text color together", () => {
		expect(cn("text-display text-fg")).toBe("text-display text-fg");
	});

	it("lets a later theme size override an earlier one", () => {
		expect(cn("text-body", "text-lead")).toBe("text-lead");
	});

	it("lets a later theme color override an earlier one", () => {
		expect(cn("text-fg-muted", "text-accent")).toBe("text-accent");
	});

	it("merges theme spacing", () => {
		expect(cn("px-4", "px-gutter")).toBe("px-gutter");
	});
});
