import { Prose } from "#/components/content/Prose/Prose";
import { Heading } from "#/components/primitives/Heading/Heading";
import { Image } from "#/components/primitives/Image/Image";
import { Link } from "#/components/primitives/Link/Link";
import { MediaPlaceholder } from "#/components/primitives/MediaPlaceholder/MediaPlaceholder";
import { Text } from "#/components/primitives/Text/Text";
import type { ProductWithPicture } from "#/content/api";

export type ProductCardProps = {
	product: ProductWithPicture;
};

/** A product with its description and a shot (or a placeholder until there is one). */
export function ProductCard({ product }: ProductCardProps) {
	return (
		<article className="grid items-center gap-10 border border-rule-strong p-panel lg:grid-cols-2 lg:gap-16">
			<div>
				<Heading level={2} size="heading-xl" className="mb-4">
					{product.url ? (
						<Link href={product.url} variant="plain" className="hover:text-accent">
							{product.name}
						</Link>
					) : (
						product.name
					)}
				</Heading>
				<Text size="body-lg" tone="muted" className="max-w-[30em]">
					{product.summary}
				</Text>
				{product.body.children.length > 0 && (
					<Prose content={product.body} size="body" className="mt-5" />
				)}
			</div>
			{product.media ? (
				<Image
					picture={product.media.picture}
					alt={product.media.alt}
					aspect="16/10"
					position={product.media.position}
					sizes="(min-width: 1024px) 520px, 100vw"
				/>
			) : (
				<MediaPlaceholder caption={product.mediaCaption} />
			)}
		</article>
	);
}
