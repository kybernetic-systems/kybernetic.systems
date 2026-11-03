import { describe, expect, it } from "vite-plus/test";

import { pendingContent } from "./status";

describe("pendingContent", () => {
	it("lists placeholders and pending reviews, sorted by file", () => {
		expect(
			pendingContent({
				roles: [
					{ slug: "founding-engineer", copyStatus: "placeholder" },
					{ slug: "designer", copyStatus: "final" },
				],
				people: [{ slug: "adit-shah", bioStatus: "placeholder" }],
				legal: [
					{ slug: "terms", review: { status: "pending-counsel" } },
					{ slug: "privacy", review: { status: "reviewed" } },
				],
			}),
		).toEqual([
			{ file: "content/legal/terms.md", reason: "pending counsel review" },
			{ file: "content/people/adit-shah.md", reason: "placeholder bio" },
			{ file: "content/roles/founding-engineer.md", reason: "placeholder copy" },
		]);
	});

	it("is empty when everything is final", () => {
		expect(pendingContent({ roles: [], people: [], legal: [] })).toEqual([]);
	});
});
