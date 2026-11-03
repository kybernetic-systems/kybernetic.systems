import { Prose } from "#/components/content/Prose/Prose";
import { TableOfContents } from "#/components/content/TableOfContents/TableOfContents";
import { Container } from "#/components/layout/Container/Container";
import { ApplyPanel } from "#/components/patterns/ApplyPanel/ApplyPanel";
import { RoleHeader } from "#/components/patterns/RoleHeader/RoleHeader";
import { ContentStatusBadge } from "#/components/primitives/ContentStatusBadge/ContentStatusBadge";
import { Link } from "#/components/primitives/Link/Link";
import type { CareersPage, Role, Site } from "#/content/api";
import { HiringSteps } from "#/pages/CareersPage";

export type RolePageProps = {
	role: Role;
	page: Pick<CareersPage, "roles" | "rolePage" | "hiring">;
	site: Pick<Site, "email" | "mailto">;
};

export function RolePage({ role, page, site }: RolePageProps) {
	const closed = role.status === "closed";
	return (
		<>
			<Container className="pt-12 pb-section md:pt-17.5">
				<RoleHeader
					role={role}
					defaultLocation={page.roles.location}
					backLabel={page.rolePage.backLabel}
				/>
				{role.copyStatus === "placeholder" && (
					<ContentStatusBadge label="Placeholder copy" className="mt-6" />
				)}
				{closed && (
					<p
						role="note"
						className="mt-8 mb-0 max-w-[40em] border-l-2 border-decor pl-5 font-serif text-body-lg text-fg"
					>
						{page.rolePage.closedNotice} <Link href="/careers">Open roles</Link>
					</p>
				)}
				<div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
					<div className="max-w-[42em] min-w-0">
						{role.headings.length > 2 && (
							<TableOfContents
								label={page.rolePage.contentsLabel}
								items={role.headings.map((heading) => ({ id: heading.id, title: heading.text }))}
								className="mb-12 border-y border-rule py-6"
							/>
						)}
						<Prose content={role.body} />
					</div>
					{!closed && (
						<div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:self-start">
							<ApplyPanel
								title={page.rolePage.applyTitle}
								body={page.rolePage.applyBody}
								ctaLabel={page.rolePage.applyCtaLabel}
								email={site.email}
								subject={role.applySubject}
								emailBody={site.mailto.role.body}
							/>
						</div>
					)}
				</div>
			</Container>
			<HiringSteps hiring={page.hiring} id="hiring" />
		</>
	);
}
