import { describe, expect, it } from "vite-plus/test";

import { post, role, site } from "#/content/fixtures";
import { pageHead } from "#/lib/seo";
import { blogPostingJsonLd, jobPostingJsonLd, organizationJsonLd } from "#/lib/structured-data";
import type { GoogleJobPosting } from "#/lib/structured-data";

/*
 * Google's rules, not Schema.org's. Every assertion here stands for a sentence in Google's job
 * posting, organization or article documentation, so a change that breaks one is a change that
 * costs us eligibility.
 */

describe("jobPostingJsonLd", () => {
	it("includes every property Google requires", () => {
		const posting = jobPostingJsonLd(role, site);
		expect(posting).toBeDefined();
		// Required, per Google: anything missing here makes the posting ineligible.
		expect(posting).toMatchObject({
			"@context": "https://schema.org",
			"@type": "JobPosting",
			"title": role.title,
			"datePosted": role.postedAt,
			"hiringOrganization": { "@type": "Organization", "name": site.legalName },
		});
		expect(posting?.description).toBeTruthy();
		expect(posting?.jobLocation).toBeDefined();
	});

	it("describes the whole job, not the summary", () => {
		// Google counts an incomplete description as a content policy violation, so the description
		// has to be the body. The summary alone would omit everything below.
		const { description } = jobPostingJsonLd(role, site) ?? {};
		expect(description).not.toBe(role.summary);
		expect(description).toContain("What we're looking for");
		expect(description).toContain("<p>");
	});

	it("locates the job without giving out a street address", () => {
		const posting = jobPostingJsonLd(role, site);
		expect(posting?.jobLocation).toMatchObject({
			"@type": "Place",
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Mumbai",
				"addressRegion": "Maharashtra",
				"addressCountry": "IN",
			},
		});
		expect(JSON.stringify(posting)).not.toContain("streetAddress");
	});

	it("uses one of Google's employment types", () => {
		expect(jobPostingJsonLd(role, site)?.employmentType).toBe("INTERN");
	});

	it("publishes the salary the page states", () => {
		expect(jobPostingJsonLd(role, site)?.baseSalary).toMatchObject({
			"@type": "MonetaryAmount",
			"currency": "INR",
			"value": { "@type": "QuantitativeValue", "value": 20_000, "unitText": "MONTH" },
		});
	});

	it("omits validThrough for a role with no closing date", () => {
		// Google: omit the property when a posting never expires.
		expect(jobPostingJsonLd(role, site)).not.toHaveProperty("validThrough");
	});

	it("marks up a rolling role, which is open with no closing date", () => {
		expect(jobPostingJsonLd({ ...role, status: "rolling" }, site)).toBeDefined();
	});

	it("marks up nothing for a role nobody can apply to yet", () => {
		// Google allows resume collection for open positions only.
		expect(jobPostingJsonLd({ ...role, status: "opening-soon" }, site)).toBeUndefined();
		expect(jobPostingJsonLd({ ...role, status: "closed" }, site)).toBeUndefined();
	});

	it("marks up nothing without a posting date, which Google requires", () => {
		expect(jobPostingJsonLd({ ...role, postedAt: undefined }, site)).toBeUndefined();
	});

	it("requires Google's required properties at the type level", () => {
		// The point of `GoogleJobPosting`: Schema.org would accept all of these omissions.
		// @ts-expect-error -- missing title, description, datePosted, hiringOrganization, jobLocation
		const bare: GoogleJobPosting = { "@context": "https://schema.org", "@type": "JobPosting" };
		// @ts-expect-error -- employmentType is narrowed to Google's case-sensitive list
		const label: GoogleJobPosting["employmentType"] = "Internship";
		expect([bare, label]).toHaveLength(2);
	});
});

describe("organizationJsonLd", () => {
	it("uses the site name as the name and keeps the legal name separate", () => {
		expect(organizationJsonLd(site)).toMatchObject({
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": site.shortName,
			"legalName": site.legalName,
			"url": site.url,
		});
	});

	it("leaves out the registered office, which is a home address", () => {
		const organization = organizationJsonLd(site);
		expect(organization).not.toHaveProperty("address");
		expect(JSON.stringify(organization)).not.toContain("Meera");
	});
});

describe("blogPostingJsonLd", () => {
	it("carries the properties Google recommends for an article", () => {
		const article = blogPostingJsonLd(post, site, "Adit Shah");
		expect(article).toMatchObject({
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": post.title,
			"datePublished": post.publishedAt,
			// Google asks for a page identifying the author, not just a name.
			"author": { "@type": "Person", "name": "Adit Shah", "url": `${site.url}/about` },
		});
		expect(article.image).toMatch(/^https:\/\//u);
	});
});

describe("pageHead", () => {
	it("escapes angle brackets so JSON-LD cannot close its own script tag", () => {
		const { scripts } = pageHead({
			site,
			title: "Test",
			path: "/test",
			jsonLd: { "@context": "https://schema.org", "@type": "Thing", "name": "</script>" },
		});
		expect(scripts[0]?.children).not.toContain("</script>");
		expect(scripts[0]?.children).toContain("\\u003c");
	});
});
