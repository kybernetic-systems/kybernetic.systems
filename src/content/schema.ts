/*
 * Content schemas. Imported by `content-collections.ts` (bundled with esbuild), so this module uses
 * relative imports only.
 */
import { z } from "zod";

/*
 * Validation messages are read by people editing Markdown, not by developers. Content Collections
 * prefixes each message with the file and field, so the message only says what's wrong and what
 * was found.
 */
z.config({
	customError: (issue) => {
		if (issue.input === undefined && issue.code === "invalid_type") return "is required";
		const got = `got ${JSON.stringify(issue.input)}`;
		switch (issue.code) {
			case "invalid_value":
				return `must be one of ${issue.values.join(", ")} (${got})`;
			case "invalid_type":
				return `must be ${issue.expected === "array" ? "a list" : `a ${issue.expected}`} (${got})`;
			case "invalid_format":
				return issue.format === "date"
					? `must be a date written as YYYY-MM-DD (${got})`
					: `must be a valid ${issue.format} (${got})`;
			case "unrecognized_keys":
				return `unknown field${issue.keys.length === 1 ? "" : "s"} ${issue.keys.map((key) => `"${key}"`).join(", ")}; check the spelling`;
			default:
				return undefined;
		}
	},
});

const date = z.iso.date();
const slug = z
	.string()
	.regex(/^[a-z\d]+(?:-[a-z\d]+)*$/u, "must be lowercase words joined by dashes");
const internalHref = z.string().startsWith("/", "must be a site path starting with /");

export const roleStatuses = ["open", "opening-soon", "rolling", "closed"] as const;

/**
 * Google's employment types, which are case-sensitive and not ours to invent. A role stores one of
 * these and `employmentTypeLabel` in `#/lib/labels` turns it into the words shown on the page.
 * @see https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
export const employmentTypes = [
	"FULL_TIME",
	"PART_TIME",
	"CONTRACTOR",
	"TEMPORARY",
	"INTERN",
	"VOLUNTEER",
	"PER_DIEM",
	"OTHER",
] as const;

/** Periods Google accepts for a published salary. */
export const salaryUnits = ["HOUR", "DAY", "WEEK", "MONTH", "YEAR"] as const;
export const imagePositions = ["center", "top", "bottom", "left", "right"] as const;

/** Tracks copy that still needs replacing. Never rendered on the public site. */
export const copyStatus = z.enum(["placeholder", "final"]).default("final");

const seo = z
	.strictObject({
		title: z.string().optional(),
		description: z.string().optional(),
		ogImage: z.string().optional(),
	})
	.optional();

const image = z.strictObject({
	src: z.string(),
	alt: z.string(),
	position: z.enum(imagePositions).default("center"),
});

const eyebrowTitleLead = z.strictObject({
	eyebrow: z.string(),
	title: z.string(),
	lead: z.string().optional(),
});

const titledItem = z.strictObject({ title: z.string(), body: z.string() });

/* Collections ---------------------------------------------------------------------------------- */

export const postSchema = z.strictObject({
	title: z.string(),
	excerpt: z.string(),
	publishedAt: date,
	updatedAt: date.optional(),
	tag: z.string(),
	author: slug,
	draft: z.boolean().default(false),
	seo,
	content: z.string(),
});

export const roleSchema = z.strictObject({
	title: z.string(),
	status: z.enum(roleStatuses),
	timing: z.string(),
	summary: z.string(),
	tags: z.array(z.string()),
	order: z.number().optional(),
	location: z.string().optional(),
	employmentType: z.enum(employmentTypes).optional(),
	compensation: z.string().optional(),
	/** Published pay, for job search engines. Only set it when the page states the figure. */
	baseSalary: z
		.strictObject({
			currency: z.string(),
			value: z.number().optional(),
			minValue: z.number().optional(),
			maxValue: z.number().optional(),
			unit: z.enum(salaryUnits),
		})
		.refine(
			({ value, minValue, maxValue }) =>
				value === undefined ? minValue !== undefined && maxValue !== undefined : true,
			"set either value, or both minValue and maxValue",
		)
		.optional(),
	applySubject: z.string().optional(),
	postedAt: date.optional(),
	validThrough: date.optional(),
	copyStatus,
	content: z.string(),
});

/**
 * Sections every role description needs. Missing ones produce a warning, not an error. Keep this
 * to sections a role is wrong without: a warning that fires on a deliberate omission teaches
 * everybody to ignore warnings. "Nice to have" and "How we work" are offered by the template but
 * left out of this list, because a role can reasonably have neither.
 */
export const recommendedRoleSections = [
	"About the role",
	"What you'll do",
	"What we're looking for",
	"Compensation & benefits",
	"How to apply",
] as const;

export const productSchema = z.strictObject({
	name: z.string(),
	summary: z.string(),
	order: z.number().optional(),
	/** A site path for a product of ours, or an absolute URL for one hosted elsewhere. */
	url: z.union([internalHref, z.url()]).optional(),
	media: image.optional(),
	mediaCaption: z.string().default("product shot — 16:10"),
	content: z.string(),
});

export const personSchema = z.strictObject({
	name: z.string(),
	role: z.string(),
	portrait: image,
	bioStatus: copyStatus,
	content: z.string(),
});

export const legalSchema = z.strictObject({
	title: z.string(),
	version: z.string(),
	lastUpdated: date,
	summaryNote: z.string().optional(),
	showToc: z.boolean().default(false),
	review: z.strictObject({
		status: z.enum(["pending-counsel", "reviewed"]),
		reviewedBy: z.string().optional(),
		reviewedAt: date.optional(),
	}),
	seo,
	content: z.string(),
});

/* Singletons ----------------------------------------------------------------------------------- */

const navLink = z.strictObject({ label: z.string(), href: internalHref });

export const siteSchema = z.strictObject({
	legalName: z.string(),
	shortName: z.string(),
	motto: z.string(),
	description: z.string(),
	url: z.url(),
	cin: z.string(),
	incorporation: z.strictObject({ year: z.number(), country: z.string() }),
	registeredOffice: z.strictObject({ lines: z.array(z.string()) }),
	phone: z.strictObject({ display: z.string(), e164: z.string() }),
	email: z.email(),
	grievanceOfficer: slug,
	nav: z.array(navLink),
	footerLinks: z.array(navLink),
	statutoryNote: z.string(),
	ogImage: z.strictObject({
		src: z.string(),
		alt: z.string(),
		width: z.number(),
		height: z.number(),
	}),
	mailto: z.strictObject({
		notify: z.strictObject({ subject: z.string(), body: z.string() }),
		contact: z.strictObject({ subject: z.string().optional() }),
		openApplication: z.strictObject({ subject: z.string(), body: z.string() }),
		role: z.strictObject({ body: z.string() }),
	}),
});

export const homeSchema = z.strictObject({
	seo,
	hero: z.strictObject({
		eyebrow: z.string(),
		titleLines: z.array(z.string()),
		lead: z.string(),
		markLabel: z.string(),
	}),
	cause: z.strictObject({ eyebrow: z.string(), statements: z.array(z.string()) }),
	name: z.strictObject({
		eyebrow: z.string(),
		word: z.string(),
		transliteration: z.string(),
		body: z.string(),
	}),
	principles: z.strictObject({ eyebrow: z.string(), items: z.array(titledItem) }),
	productsTeaser: z.strictObject({
		eyebrow: z.string(),
		title: z.string(),
		body: z.string(),
		linkLabel: z.string(),
		href: internalHref,
	}),
	careersTeaser: z.strictObject({
		eyebrow: z.string(),
		title: z.string(),
		body: z.string(),
		linkLabel: z.string(),
		href: internalHref,
	}),
	blogTeaser: z.strictObject({ eyebrow: z.string(), linkLabel: z.string(), href: internalHref }),
	featuredPostCount: z.number().int().positive(),
});

export const aboutSchema = z.strictObject({
	seo,
	intro: eyebrowTitleLead,
	thinking: z.strictObject({ eyebrow: z.string(), body: z.string() }),
	values: z.strictObject({ eyebrow: z.string(), items: z.array(titledItem) }),
	team: z.strictObject({ eyebrow: z.string(), people: z.array(slug) }),
});

export const productsPageSchema = z.strictObject({
	seo,
	intro: eyebrowTitleLead,
	notify: z.strictObject({
		title: z.string(),
		body: z.string(),
		ctaLabel: z.string(),
		privacyNote: z.string(),
	}),
});

export const mangroveSchema = z.strictObject({
	seo,
	hero: eyebrowTitleLead,
	premise: z.strictObject({ eyebrow: z.string(), statements: z.array(z.string()) }),
	howItWorks: z.strictObject({ eyebrow: z.string(), items: z.array(titledItem) }),
	sovereignty: z.strictObject({ eyebrow: z.string(), body: z.string() }),
	uses: z.strictObject({ eyebrow: z.string(), items: z.array(titledItem) }),
	notify: z.strictObject({
		title: z.string(),
		body: z.string(),
		ctaLabel: z.string(),
		privacyNote: z.string(),
	}),
	company: z.strictObject({
		eyebrow: z.string(),
		title: z.string(),
		body: z.string(),
		linkLabel: z.string(),
		href: internalHref,
	}),
});

export const blogPageSchema = z.strictObject({
	seo,
	intro: eyebrowTitleLead,
	backLabel: z.string(),
	readNextEyebrow: z.string(),
	readNextCount: z.number().int().positive(),
});

export const careersPageSchema = z.strictObject({
	seo,
	intro: eyebrowTitleLead,
	roles: z.strictObject({
		eyebrow: z.string(),
		location: z.string(),
		readLabel: z.string(),
		emptyMessage: z.string(),
	}),
	hiring: z.strictObject({ eyebrow: z.string(), lead: z.string(), steps: z.array(titledItem) }),
	/** Pay, time off and security: the things a job here comes with, rather than how we hire. */
	commitments: z.strictObject({ eyebrow: z.string(), body: z.string() }),
	honesty: z.strictObject({ eyebrow: z.string(), body: z.string() }),
	openApplication: z.strictObject({ title: z.string(), body: z.string(), ctaLabel: z.string() }),
	rolePage: z.strictObject({
		backLabel: z.string(),
		applyTitle: z.string(),
		applyBody: z.string(),
		applyCtaLabel: z.string(),
		closedNotice: z.string(),
		contentsLabel: z.string(),
	}),
});

export const contactPageSchema = z.strictObject({
	seo,
	intro: eyebrowTitleLead,
	details: z.strictObject({
		emailLabel: z.string(),
		phoneLabel: z.string(),
		officeLabel: z.string(),
		grievancesLabel: z.string(),
		grievancesBody: z.string(),
	}),
	writeToUs: z.strictObject({
		title: z.string(),
		body: z.string(),
		ctaLabel: z.string(),
		privacyNote: z.string(),
	}),
});
