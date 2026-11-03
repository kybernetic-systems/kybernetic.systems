/*
 * JSON-LD for the pages that carry it. Two layers, because `schema-dts` types the Schema.org
 * vocabulary and not Google's rules on top of it: Schema.org marks every `JobPosting` property
 * optional and types `employmentType` as free text, so `schema-dts` alone would accept a posting
 * Google rejects. The `Google*` types below close that gap, and the builders are the only place
 * allowed to construct a block.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/job-posting
 * @see https://developers.google.com/search/docs/appearance/structured-data/organization
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
import type {
	BlogPostingLeaf,
	JobPostingLeaf,
	OrganizationLeaf,
	QuantitativeValueLeaf,
	Thing,
	WithContext,
} from "schema-dts";

import type { Post, Role, Site } from "#/content/api";

/** Anything `pageHead` will serialize into a `ld+json` script. */
export type JsonLd = WithContext<Thing>;

/** Makes the properties Google requires non-optional, leaving the rest as Schema.org has them. */
type Require<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

/**
 * A posting with the five properties Google lists as required. Leaving one out is a type error
 * here, where Schema.org would have allowed it.
 */
export type GoogleJobPosting = Require<
	WithContext<JobPostingLeaf>,
	"title" | "description" | "datePosted" | "hiringOrganization" | "jobLocation"
> & {
	/** Narrowed from Schema.org's free text to Google's case-sensitive list. */
	employmentType?: NonNullable<Role["employmentType"]>;
};

/**
 * Statuses that may carry posting markup. Google allows resume collection "for open positions
 * only" and warns it may remove solicitations from employers "not currently hiring", which is
 * exactly what `opening-soon` would be. A `rolling` role is open with no closing date, so it
 * qualifies, and Google says to omit `validThrough` when a posting never expires.
 */
const markupStatuses = new Set<Role["status"]>(["open", "rolling"]);

/** Mumbai, to the precision a job seeker needs. The registered office is a home address. */
const workplace = {
	"@type": "Place",
	"address": {
		"@type": "PostalAddress",
		"addressLocality": "Mumbai",
		"addressRegion": "Maharashtra",
		"postalCode": "400006",
		"addressCountry": "IN",
	},
} as const;

/** The company itself. Belongs on one page, not every page. */
export function organizationJsonLd(site: Site): WithContext<OrganizationLeaf> {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		// `name` is the name the site goes by; `legalName` is the one on the incorporation
		// certificate. Google asks for them in that order, not the reverse.
		"name": site.shortName,
		"legalName": site.legalName,
		"url": site.url,
		"description": site.description,
		"logo": new URL("/web-app-manifest-512x512.png", site.url).href,
		"email": site.email,
		"telephone": site.phone.e164,
		"foundingDate": String(site.incorporation.year),
		// No `address`: the registered office is a home address, and marking it up invites it into
		// knowledge panels and maps. The statutory disclosure stays on the page as text.
	};
}

/**
 * A role, when its status says somebody can apply today. Returns `undefined` otherwise, which is
 * what keeps an unavailable posting out of job search results.
 */
export function jobPostingJsonLd(
	role: Pick<
		Role,
		| "slug"
		| "title"
		| "status"
		| "descriptionHtml"
		| "employmentType"
		| "baseSalary"
		| "postedAt"
		| "validThrough"
	>,
	site: Pick<Site, "legalName" | "url">,
): GoogleJobPosting | undefined {
	if (!markupStatuses.has(role.status) || !role.postedAt) return undefined;
	const posting: GoogleJobPosting = {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		"title": role.title,
		// The whole description, not the summary: Google treats an incomplete one as a policy
		// violation and wants responsibilities, qualifications and requirements in it.
		"description": role.descriptionHtml,
		"datePosted": role.postedAt,
		"hiringOrganization": {
			"@type": "Organization",
			"name": site.legalName,
			"sameAs": site.url,
		},
		"jobLocation": workplace,
		"identifier": {
			"@type": "PropertyValue",
			"name": site.legalName,
			"value": role.slug,
		},
	};
	if (role.employmentType) posting.employmentType = role.employmentType;
	if (role.baseSalary) {
		const { currency, value, minValue, maxValue, unit } = role.baseSalary;
		// A single figure or a range; the content schema insists on one or the other.
		const amount: QuantitativeValueLeaf = { "@type": "QuantitativeValue", "unitText": unit };
		if (value !== undefined) amount.value = value;
		if (minValue !== undefined) amount.minValue = minValue;
		if (maxValue !== undefined) amount.maxValue = maxValue;
		posting.baseSalary = { "@type": "MonetaryAmount", "currency": currency, "value": amount };
	}
	// Set only when the role has a closing date: Google says to omit it when a posting never
	// expires. `directApply` stays off too, because applications come by email rather than through
	// a form on the page.
	if (role.validThrough) posting.validThrough = role.validThrough;
	return posting;
}

/** A blog post. Google lists no required properties for an article. */
export function blogPostingJsonLd(
	post: Pick<Post, "slug" | "title" | "excerpt" | "publishedAt" | "updatedAt" | "seo">,
	site: Pick<Site, "legalName" | "url" | "ogImage">,
	author: string,
): WithContext<BlogPostingLeaf> {
	const url = new URL(`/blog/${post.slug}`, site.url).href;
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"headline": post.title,
		"description": post.excerpt,
		"datePublished": post.publishedAt,
		"dateModified": post.updatedAt ?? post.publishedAt,
		"image": new URL(post.seo?.ogImage ?? site.ogImage.src, site.url).href,
		"author": {
			"@type": "Person",
			"name": author,
			// Google asks for a page that identifies the author, not just a name.
			"url": new URL("/about", site.url).href,
		},
		"publisher": {
			"@type": "Organization",
			"name": site.legalName,
			"url": site.url,
		},
		"mainEntityOfPage": url,
		"inLanguage": "en-US",
	};
}
