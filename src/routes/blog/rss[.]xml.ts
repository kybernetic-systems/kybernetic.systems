import { createFileRoute } from "@tanstack/react-router";

import { getBlogPage, getPostSummaries, getSite } from "#/content/api";
import { renderRss } from "#/lib/rss";

export const Route = createFileRoute("/blog/rss.xml")({
	server: {
		handlers: {
			GET: () => {
				const site = getSite();
				const page = getBlogPage();
				const xml = renderRss({
					title: `${site.shortName} — ${page.intro.eyebrow}`,
					description: page.intro.lead ?? site.description,
					siteUrl: site.url,
					feedPath: "/blog/rss.xml",
					items: getPostSummaries().map((post) => ({
						title: post.title,
						path: `/blog/${post.slug}`,
						description: post.excerpt,
						publishedAt: post.publishedAt,
					})),
				});
				return new Response(xml, {
					headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
				});
			},
		},
	},
});
