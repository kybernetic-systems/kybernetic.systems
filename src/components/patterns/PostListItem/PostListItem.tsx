import { Heading } from "#/components/primitives/Heading/Heading";
import { Link } from "#/components/primitives/Link/Link";
import { Meta } from "#/components/primitives/Meta/Meta";
import { Text } from "#/components/primitives/Text/Text";
import { Time } from "#/components/primitives/Time/Time";
import type { PostSummary } from "#/content/api";

export type PostListItemProps = { post: PostSummary };

/** A row in the blog index: date, title and excerpt, and the tag on wide screens. */
export function PostListItem({ post }: PostListItemProps) {
	return (
		<article className="group relative grid gap-3 border-t border-rule py-8 transition-colors hover:bg-tint/50 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[12.5rem_minmax(0,1fr)_9.5rem] lg:gap-12 lg:py-10">
			<Meta size="sm" tracking="meta" className="md:mt-1.5">
				<Time date={post.publishedAt} />
				<span className="lg:hidden"> · {post.tag}</span>
			</Meta>
			<div className="max-w-[36em]">
				<Heading
					level={2}
					size="heading-lg"
					className="mb-3 transition-colors group-hover:text-accent"
				>
					<Link
						href={`/blog/${post.slug}`}
						variant="plain"
						current="none"
						className="stretched-link"
					>
						{post.title}
					</Link>
				</Heading>
				<Text tone="muted">{post.excerpt}</Text>
			</div>
			<Meta tone="accent" tracking="meta" className="hidden lg:mt-1.5 lg:block lg:text-right">
				{post.tag}
			</Meta>
		</article>
	);
}
