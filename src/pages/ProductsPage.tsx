import { Container } from "#/components/layout/Container/Container";
import { Section } from "#/components/layout/Section/Section";
import { NotifyCta } from "#/components/patterns/NotifyCta/NotifyCta";
import { PageIntro } from "#/components/patterns/PageIntro/PageIntro";
import { ProductCard } from "#/components/patterns/ProductCard/ProductCard";
import type { ProductsPage as ProductsPageContent, ProductWithPicture, Site } from "#/content/api";

export type ProductsPageProps = {
	page: ProductsPageContent;
	products: ProductWithPicture[];
	site: Pick<Site, "email" | "mailto">;
};

export function ProductsPage({ page, products, site }: ProductsPageProps) {
	return (
		<>
			<PageIntro eyebrow={page.intro.eyebrow} title={page.intro.title} lead={page.intro.lead} />
			<Section spacing="none" className="pb-section">
				<Container>
					<ul className="m-0 grid list-none gap-10 p-0">
						{products.map((product) => (
							<li key={product.slug}>
								<ProductCard product={product} />
							</li>
						))}
					</ul>
				</Container>
			</Section>
			<NotifyCta
				title={page.notify.title}
				body={page.notify.body}
				ctaLabel={page.notify.ctaLabel}
				privacyNote={page.notify.privacyNote}
				email={site.email}
				subject={site.mailto.notify.subject}
				emailBody={site.mailto.notify.body}
			/>
		</>
	);
}
