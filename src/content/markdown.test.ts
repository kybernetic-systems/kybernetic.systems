import { describe, expect, it } from "vite-plus/test";
import { z } from "zod";

import {
	extractHeadings,
	inlineMarkdownToHast,
	interpolate,
	interpolateDocument,
	markdownToHast,
	splitSections,
	textOf,
} from "./markdown";

const site = {
	legalName: "Kybernetic Systems Private Limited",
	shortName: "Kybernetic Systems",
	email: "adit.shah@kybernetic.systems",
	cin: "U62099MH2026PTC473103",
	phone: { display: "+91 74000 38006" },
	registeredOffice: { lines: ["27 Meera Building", "18 L.D. Ruparel Marg"] },
};

describe("markdownToHast", () => {
	it("compiles paragraphs, quotes and emphasis to plain JSON", () => {
		expect(markdownToHast("Hello *world*.\n\n> A quote.")).toEqual({
			type: "root",
			children: [
				{
					type: "element",
					tagName: "p",
					properties: {},
					children: [
						{ type: "text", value: "Hello " },
						{
							type: "element",
							tagName: "em",
							properties: {},
							children: [{ type: "text", value: "world" }],
						},
						{ type: "text", value: "." },
					],
				},
				{ type: "text", value: "\n" },
				{
					type: "element",
					tagName: "blockquote",
					properties: {},
					children: [
						{ type: "text", value: "\n" },
						{
							type: "element",
							tagName: "p",
							properties: {},
							children: [{ type: "text", value: "A quote." }],
						},
						{ type: "text", value: "\n" },
					],
				},
			],
		});
	});

	it("drops raw HTML tags, keeping only their text", () => {
		const root = markdownToHast("Before <script>alert(1)</script> after");
		expect(JSON.stringify(root)).not.toContain("script");
		expect(textOf(root)).toBe("Before alert(1) after");
	});

	it("links bare email addresses", () => {
		const [paragraph] = markdownToHast("Write to adit.shah@kybernetic.systems.").children;
		expect(paragraph).toMatchObject({
			children: [
				{},
				{ tagName: "a", properties: { href: "mailto:adit.shah@kybernetic.systems" } },
				{},
			],
		});
	});
});

describe("inlineMarkdownToHast", () => {
	it("unwraps the paragraph", () => {
		expect(inlineMarkdownToHast("See our [privacy policy](/privacy).").children).toMatchObject([
			{ type: "text", value: "See our " },
			{ tagName: "a", properties: { href: "/privacy" } },
			{ type: "text", value: "." },
		]);
	});

	it("rejects block content", () => {
		expect(() => inlineMarkdownToHast("One.\n\nTwo.")).toThrow("Expected a single line of text");
	});
});

describe("sections", () => {
	const root = markdownToHast("## Who we are\n\nA company.\n\n## What we collect\n\n- Email\n");

	it("extracts headings with slug ids", () => {
		expect(extractHeadings(root)).toEqual([
			{ id: "who-we-are", text: "Who we are" },
			{ id: "what-we-collect", text: "What we collect" },
		]);
	});

	it("numbers sections in order", () => {
		const sections = splitSections(root);
		expect(sections.map(({ id, number, title }) => ({ id, number, title }))).toEqual([
			{ id: "who-we-are", number: "01", title: "Who we are" },
			{ id: "what-we-collect", number: "02", title: "What we collect" },
		]);
		expect(textOf(sections[0]?.body ?? { type: "root", children: [] })).toContain("A company.");
	});

	it("rejects text before the first heading", () => {
		expect(() => splitSections(markdownToHast("Intro.\n\n## Heading"))).toThrow(
			"before the first ## heading",
		);
	});
});

describe("interpolate", () => {
	it("replaces site placeholders", () => {
		expect(interpolate("Write to {site.email} or call {site.phone}.", site)).toBe(
			"Write to adit.shah@kybernetic.systems or call +91 74000 38006.",
		);
		expect(interpolate("{site.registeredOffice}", site)).toBe(
			"27 Meera Building, 18 L.D. Ruparel Marg",
		);
	});

	it("fails on unknown placeholders", () => {
		expect(() => interpolate("{site.fax}", site)).toThrow("Unknown placeholder {site.fax}");
	});
});

describe("interpolateDocument", () => {
	const schema = z.strictObject({ title: z.string(), items: z.array(z.string()) });

	it("replaces placeholders in nested strings and keeps the shape", () => {
		expect(
			interpolateDocument(schema, { title: '"{site.shortName}"', items: ["{site.cin}"] }, site),
		).toEqual({ title: '"Kybernetic Systems"', items: ["U62099MH2026PTC473103"] });
	});
});
