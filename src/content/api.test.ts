import { describe, expect, it } from "vite-plus/test";

import {
	getCareersPage,
	getHomePage,
	getLegal,
	getPerson,
	getPost,
	getPosts,
	getPostSummaries,
	getProducts,
	getReadNext,
	getRole,
	getRoles,
	getSite,
} from "./api";
import { textOf } from "./markdown";

describe("site", () => {
	it("uses the legal name and email", () => {
		expect(getSite()).toMatchObject({
			legalName: "Kybernetic Systems Private Limited",
			email: "adit.shah@kybernetic.systems",
		});
	});

	it("names Blog in the navigation", () => {
		expect(getSite().nav).toContainEqual({ label: "Blog", href: "/blog" });
	});
});

describe("posts", () => {
	/*
	 * `content/posts` is empty until the first real post is written, so these cover the behavior
	 * that holds with nothing published. The ordering, slug lookup and read-next assertions that
	 * used to live here were pinned to the AI-written placeholders and went with them; restore
	 * them against real content once there is some.
	 */
	it("lists nothing while nothing is published", () => {
		expect(getPostSummaries()).toEqual([]);
		expect(getPosts()).toEqual([]);
	});

	it("finds no post, rather than throwing, for an unknown slug", () => {
		expect(getPost("complex-domains")).toBeUndefined();
	});

	it("suggests nothing to read next", () => {
		expect(getReadNext("anything", 3)).toEqual([]);
	});
});

describe("roles", () => {
	it("lists roles in order", () => {
		expect(getRoles().map((role) => role.slug)).toEqual(["internship"]);
	});

	it("finds a role with its sections", () => {
		const role = getRole("internship");
		expect(role?.applySubject).toBe("Internship");
		expect(role?.headings.map((heading) => heading.text)).toContain("How to apply");
	});

	it("doesn't leak the template", () => {
		expect(getRole("_template")).toBeUndefined();
	});
});

describe("people", () => {
	it("resolves the portrait into responsive sources", () => {
		const person = getPerson("adit-shah");
		expect(person.name).toBe("Adit Shah");
		expect(Object.keys(person.portrait.picture.sources).toSorted()).toEqual(["avif", "webp"]);
		expect(textOf(person.bio)).not.toContain("{site.shortName}");
		expect(textOf(person.bio)).toContain("Kybernetic Systems");
	});
});

describe("products", () => {
	it("lists Mangrove as a site path, with no media yet", () => {
		expect(getProducts()).toMatchObject([
			{
				slug: "mangrove",
				name: "Mangrove",
				// A path, not a host: Link resolves it to the mangrove subdomain of whatever host serves it.
				url: "/mangrove",
			},
		]);
		expect(getProducts()[0]?.media).toBeUndefined();
	});
});

describe("legal", () => {
	it("numbers privacy sections and fills in placeholders", () => {
		const privacy = getLegal("privacy");
		expect(privacy.sections).toHaveLength(11);
		expect(privacy.sections[0]).toMatchObject({
			number: "01",
			title: "Who we are",
			id: "who-we-are",
		});
		const text = privacy.sections.map((section) => textOf(section.body)).join("\n");
		expect(text).toContain("adit.shah@kybernetic.systems");
		expect(text).not.toContain("{site.");
		expect(text).not.toContain("contact form");
	});

	it("keeps the terms summary note", () => {
		expect(getLegal("terms").summaryNote).toBe(
			"These terms cover this website only; each product will carry its own terms of service.",
		);
	});
});

describe("pages", () => {
	it("compiles inline emphasis in the home statements", () => {
		const [first] = getHomePage().cause.statements;
		expect(first?.children).toContainEqual(expect.objectContaining({ tagName: "em" }));
	});

	it("leaves no unfilled placeholders in any copy", () => {
		// Catches a token that was mistyped, or added to a field the transform does not interpolate.
		const copy = JSON.stringify([
			getCareersPage(),
			getHomePage(),
			getLegal("privacy"),
			getPerson("adit-shah"),
			getRole("internship"),
		]);
		expect(copy).not.toContain("{site.");
	});
});
