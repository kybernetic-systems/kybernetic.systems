import { describe, expect, it } from "vite-plus/test";

import { renderRss } from "./rss";

describe("renderRss", () => {
	const xml = renderRss({
		title: "Kybernetic Systems — Blog",
		description: "Notes on steering",
		siteUrl: "https://kybernetic.systems",
		feedPath: "/blog/rss.xml",
		items: [
			{
				title: "Q&A <draft>",
				path: "/blog/q-and-a",
				description: 'It\'s "quoted"',
				publishedAt: "2026-07-12",
			},
		],
	});

	it("uses absolute links", () => {
		expect(xml).toContain("<link>https://kybernetic.systems/blog/q-and-a</link>");
		expect(xml).toContain('href="https://kybernetic.systems/blog/rss.xml"');
	});

	it("escapes XML", () => {
		expect(xml).toContain("<title>Q&amp;A &lt;draft&gt;</title>");
		expect(xml).toContain("<description>It&apos;s &quot;quoted&quot;</description>");
	});

	it("dates items in RFC 822", () => {
		expect(xml).toContain("<pubDate>Sun, 12 Jul 2026 00:00:00 GMT</pubDate>");
	});
});
