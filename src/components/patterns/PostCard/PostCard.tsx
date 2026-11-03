import { Heading } from "#/components/primitives/Heading/Heading";
import { Link } from "#/components/primitives/Link/Link";
import { Meta } from "#/components/primitives/Meta/Meta";
import { Text } from "#/components/primitives/Text/Text";
import { Time } from "#/components/primitives/Time/Time";
import type { PostSummary } from "#/content/api";

export type PostCardProps = {
	post: PostSummary;
	/** `featured` shows the tag and excerpt; `compact` only the date and title. */
	variant?: "featured" | "compact";
	headingLevel?: 2 | 3;
};

/**
 * A post teaser. The whole card is clickable, but only the title is the link, so assistive
 * technology announces just the title.
 */
export function PostCard({ post, variant = "featured", headingLevel = 3 }: PostCardProps) {
	return (
		<article className="group relative border-t border-rule-strong pt-6">
			<Meta className="mb-4 md:mb-4.5">
				<Time date={post.publishedAt} />
				{variant === "featured" && <> · {post.tag}</>}
			</Meta>
			<Heading
				level={headingLevel}
				size="heading-md"
				className="transition-colors group-hover:text-accent"
			>
				<Link href={`/blog/${post.slug}`} variant="plain" current="none" className="stretched-link">
					{post.title}
				</Link>
			</Heading>
			{variant === "featured" && (
				<Text tone="muted" className="mt-3.5">
					{post.excerpt}
				</Text>
			)}
		</article>
	);
}
