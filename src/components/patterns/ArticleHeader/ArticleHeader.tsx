import { Heading } from "#/components/primitives/Heading/Heading";
import { Meta } from "#/components/primitives/Meta/Meta";
import { Rule } from "#/components/primitives/Rule/Rule";
import { Text } from "#/components/primitives/Text/Text";
import { Time } from "#/components/primitives/Time/Time";
import type { PostSummary } from "#/content/api";

export type ArticleHeaderProps = { post: PostSummary };

/** A post's metadata, title and standfirst. */
export function ArticleHeader({ post }: ArticleHeaderProps) {
	return (
		<header>
			<Meta size="sm" className="mb-6 md:mb-6.5">
				<Time date={post.publishedAt} /> · {post.tag} · {post.readingTime}
			</Meta>
			<Heading level={1} size="display" className="mb-7 md:mb-7.5">
				{post.title}
			</Heading>
			<Text size="lead" tone="muted" italic>
				{post.excerpt}
			</Text>
			<Rule variant="accent" className="my-10 md:my-13" />
		</header>
	);
}
