import { formatRfc822 } from "#/lib/format-date";

export type RssItem = { title: string; path: string; description: string; publishedAt: string };

export type RssFeed = {
	title: string;
	description: string;
	siteUrl: string;
	feedPath: string;
	items: RssItem[];
};

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

/** An RSS 2.0 document. */
export function renderRss({ title, description, siteUrl, feedPath, items }: RssFeed): string {
	const url = (path: string) => escapeXml(new URL(path, siteUrl).href);
	const entries = items
		.map(
			(item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url(item.path)}</link>
      <guid isPermaLink="true">${url(item.path)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${formatRfc822(item.publishedAt)}</pubDate>
    </item>`,
		)
		.join("\n");
	const lastBuild = items[0]
		? `\n    <lastBuildDate>${formatRfc822(items[0].publishedAt)}</lastBuildDate>`
		: "";
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${url("/blog")}</link>
    <description>${escapeXml(description)}</description>
    <language>en-US</language>
    <atom:link href="${url(feedPath)}" rel="self" type="application/rss+xml"/>${lastBuild}
${entries}
  </channel>
</rss>
`;
}
