import { ArrowLink } from "#/components/primitives/ArrowLink/ArrowLink";
import { Badge } from "#/components/primitives/Badge/Badge";
import { Chip } from "#/components/primitives/Chip/Chip";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Meta } from "#/components/primitives/Meta/Meta";
import type { Role } from "#/content/api";
import { employmentTypeLabel, roleStatusLabel } from "#/lib/labels";

export type RoleHeaderProps = {
	role: Pick<
		Role,
		"title" | "status" | "timing" | "tags" | "location" | "employmentType" | "compensation"
	>;
	/** Shown when the role doesn't set its own location. */
	defaultLocation: string;
	backLabel: string;
};

/** The top of a role page. */
export function RoleHeader({ role, defaultLocation, backLabel }: RoleHeaderProps) {
	const details = [
		role.timing,
		role.location ?? defaultLocation,
		role.employmentType && employmentTypeLabel[role.employmentType],
		role.compensation,
	].filter(Boolean);
	return (
		<header>
			<ArrowLink href="/careers" appearance="label" direction="back" className="mb-10 md:mb-14">
				{backLabel}
			</ArrowLink>
			<div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3">
				<Badge>{roleStatusLabel[role.status]}</Badge>
				<Meta as="p">{details.join(" · ")}</Meta>
			</div>
			<Heading level={1} size="display" className="mb-8">
				{role.title}
			</Heading>
			<ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
				{role.tags.map((tag) => (
					<li key={tag}>
						<Chip>{tag}</Chip>
					</li>
				))}
			</ul>
		</header>
	);
}
