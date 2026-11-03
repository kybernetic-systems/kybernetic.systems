import { describe, expect, it } from "vite-plus/test";

import { mailto } from "./mailto";

describe("mailto", () => {
	it("links to the address alone", () => {
		expect(mailto({ to: "adit.shah@kybernetic.systems" })).toBe(
			"mailto:adit.shah@kybernetic.systems",
		);
	});

	it("encodes the subject with %20, not +", () => {
		expect(mailto({ to: "a@b.co", subject: "Open application" })).toBe(
			"mailto:a@b.co?subject=Open%20application",
		);
	});

	it("encodes line breaks, ampersands and dashes in the body", () => {
		expect(mailto({ to: "a@b.co", subject: "Q&A", body: "Hi,\n\n— Adit" })).toBe(
			"mailto:a@b.co?subject=Q%26A&body=Hi%2C%0A%0A%E2%80%94%20Adit",
		);
	});

	it("skips empty parts", () => {
		expect(mailto({ to: "a@b.co", subject: "", body: "Hello" })).toBe("mailto:a@b.co?body=Hello");
	});
});
