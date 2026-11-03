import { Prose } from "#/components/content/Prose/Prose";
import { ContentStatusBadge } from "#/components/primitives/ContentStatusBadge/ContentStatusBadge";
import { Eyebrow } from "#/components/primitives/Eyebrow/Eyebrow";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Image } from "#/components/primitives/Image/Image";
import type { PersonWithPicture } from "#/content/api";

export type ProfileCardProps = {
	person: PersonWithPicture;
	headingLevel?: 2 | 3;
};

/** A person: portrait, name, role and bio. */
export function ProfileCard({ person, headingLevel = 3 }: ProfileCardProps) {
	return (
		<article className="grid items-start gap-8 md:grid-cols-[12.5rem_minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
			<Image
				picture={person.portrait.picture}
				alt={person.portrait.alt}
				position={person.portrait.position}
				aspect="4/5"
				sizes="(min-width: 1024px) 240px, (min-width: 768px) 200px, 240px"
				className="w-full max-w-60 border border-rule-strong"
			/>
			<div>
				<Heading level={headingLevel} size="heading-xl" className="mb-1.5">
					{person.name}
				</Heading>
				<Eyebrow tracking="label" className="mb-7">
					{person.role}
				</Eyebrow>
				<div className="grid max-w-measure gap-5.5">
					<Prose content={person.bio} size="body" />
				</div>
				{person.bioStatus === "placeholder" && (
					<ContentStatusBadge label="Placeholder bio" className="mt-6" />
				)}
			</div>
		</article>
	);
}
