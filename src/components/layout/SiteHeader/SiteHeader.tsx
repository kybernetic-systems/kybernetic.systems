import { Container } from "#/components/layout/Container/Container";
import { MobileMenu } from "#/components/layout/MobileMenu/MobileMenu";
import type { NavItem } from "#/components/layout/MobileMenu/MobileMenu";
import { Link } from "#/components/primitives/Link/Link";
import { Logo } from "#/components/primitives/Logo/Logo";
import { Wordmark } from "#/components/primitives/Wordmark/Wordmark";

export type SiteHeaderProps = { nav: NavItem[] };

/** Sticky header: home link, primary navigation on wider screens, and a menu on narrow ones. */
export function SiteHeader({ nav }: SiteHeaderProps) {
	return (
		<header className="sticky top-0 z-50 border-b border-rule bg-frosted">
			<Container className="flex h-header items-center justify-between gap-8">
				<Link href="/" variant="plain" current="none" className="flex items-center gap-3.5 py-2">
					<Logo decorative className="size-8 lg:size-[34px]" />
					<Wordmark />
				</Link>
				<nav aria-label="Primary" className="hidden md:block">
					<ul className="m-0 flex list-none items-center gap-6 p-0 lg:gap-8.5">
						{nav.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									variant="nav"
									current="within"
									className="relative block py-2 font-serif text-body-lg text-fg after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-decor after:transition-transform aria-[current]:after:scale-x-100"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<MobileMenu items={nav} className="md:hidden" />
			</Container>
		</header>
	);
}
