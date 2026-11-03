import type { employmentTypes, roleStatuses } from "#/content/schema";

export const roleStatusLabel: Record<(typeof roleStatuses)[number], string> = {
	"open": "Open",
	"opening-soon": "Opening soon",
	"rolling": "Rolling",
	"closed": "Closed",
};

/** Google's employment types in the words the page shows. */
export const employmentTypeLabel: Record<(typeof employmentTypes)[number], string> = {
	FULL_TIME: "Full-time",
	PART_TIME: "Part-time",
	CONTRACTOR: "Contract",
	TEMPORARY: "Fixed-term",
	INTERN: "Internship",
	VOLUNTEER: "Voluntary",
	PER_DIEM: "Daily rate",
	OTHER: "Other",
};
