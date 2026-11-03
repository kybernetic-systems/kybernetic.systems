import { ArrowLink } from "#/components/primitives/ArrowLink/ArrowLink";
import { Badge } from "#/components/primitives/Badge/Badge";
import { Chip } from "#/components/primitives/Chip/Chip";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Link } from "#/components/primitives/Link/Link";
import { Meta } from "#/components/primitives/Meta/Meta";
import { Text } from "#/components/primitives/Text/Text";
import { VisuallyHidden } from "#/components/primitives/VisuallyHidden/VisuallyHidden";
import type { RoleSummary } from "#/content/api";
import { roleStatusLabel } from "#/lib/labels";

export type RoleListItemProps = {
	role: RoleSummary;
	readLabel: string;
};

/** A role in the Careers list, linking to its own page. */
export function RoleListItem({ role, readLabel }: RoleListItemProps) {
	const href = `/careers/${role.slug}`;
	return (
		<article className="grid gap-6 border-t border-rule py-10 md:grid-cols-[minmax(0,1fr)_12.5rem] md:gap-14">
			<div className="max-w-[40em]">
				<div className="mb-3.5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
					<Heading level={3} size="heading-lg">
						<Link href={href} variant="plain" current="none" className="hover:text-accent">
							{role.title}
						</Link>
					</Heading>
					<Badge>{roleStatusLabel[role.status]}</Badge>
				</div>
				<Text size="body-lg" className="mb-5">
					{role.summary}
				</Text>
				<ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
					{role.tags.map((tag) => (
						<li key={tag}>
							<Chip>{tag}</Chip>
						</li>
					))}
				</ul>
			</div>
			<div className="md:text-right">
				<Meta className="mb-3.5">{role.timing}</Meta>
				<ArrowLink href={href} appearance="text">
					{readLabel}
					<VisuallyHidden> for {role.title}</VisuallyHidden>
				</ArrowLink>
			</div>
		</article>
	);
}
