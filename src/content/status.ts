/*
 * Which content still holds placeholder copy or awaits review. Shared by `vp run content:status`
 * (plain Node, so type-only imports) and the unit tests.
 */
import type { Legal, Person, Role } from "#content-collections";

export type PendingItem = { file: string; reason: string };

export type StatusSources = {
	roles: Pick<Role, "slug" | "copyStatus">[];
	people: Pick<Person, "slug" | "bioStatus">[];
	legal: Pick<Legal, "slug" | "review">[];
};

export function pendingContent({ roles, people, legal }: StatusSources): PendingItem[] {
	return [
		...roles
			.filter((role) => role.copyStatus === "placeholder")
			.map((role) => ({ file: `content/roles/${role.slug}.md`, reason: "placeholder copy" })),
		...people
			.filter((person) => person.bioStatus === "placeholder")
			.map((person) => ({ file: `content/people/${person.slug}.md`, reason: "placeholder bio" })),
		...legal
			.filter((document) => document.review.status === "pending-counsel")
			.map((document) => ({
				file: `content/legal/${document.slug}.md`,
				reason: "pending counsel review",
			})),
	].toSorted((a, b) => a.file.localeCompare(b.file));
}
