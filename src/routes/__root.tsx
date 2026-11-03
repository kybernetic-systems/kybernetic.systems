import serifFont from "@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2?url";
import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";

import { ProductShell } from "#/components/layout/ProductShell/ProductShell";
import { SiteShell } from "#/components/layout/SiteShell/SiteShell";
import markSvg from "#/components/primitives/Logo/mark.svg?url";
import { getPerson, getSite } from "#/content/api";
import { PublicOriginProvider } from "#/lib/origin";
import type { ProductSubdomain } from "#/lib/subdomain";
import { productForPath, productOrigin, products } from "#/lib/subdomain";
import { NotFoundPage } from "#/pages/NotFoundPage";

import globalCss from "#/global.css?url";

export const Route = createRootRoute({
	loader: () => {
		const site = getSite();
		return {
			site,
			grievanceOfficer: getPerson(site.grievanceOfficer).name,
			year: new Date().getUTCFullYear(),
		};
	},
	head: ({ loaderData }) => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ name: "theme-color", content: "#0a1a3a" },
			{ name: "apple-mobile-web-app-title", content: "Kybernetics" },
			// Every page sets its own title; this one is left for addresses that don't match a page.
			{ title: loaderData ? `Page not found · ${loaderData.site.shortName}` : "Page not found" },
		],
		links: [
			{ rel: "preload", href: serifFont, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
			{ rel: "stylesheet", href: globalCss },
			{ rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
			{ rel: "icon", type: "image/svg+xml", href: markSvg },
			{ rel: "shortcut icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
			{ rel: "manifest", href: "/site.webmanifest" },
			{ rel: "alternate", type: "application/rss+xml", title: "Blog", href: "/blog/rss.xml" },
		],
		// The company's own `Organization` markup belongs on a single page, so it lives in the home
		// route rather than here, where it would repeat on every page of the site.
	}),
	component: RootComponent,
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en-US">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				{import.meta.env.DEV && (
					<TanStackDevtools
						config={{ position: "bottom-right" }}
						plugins={[{ name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> }]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}

/**
 * The origin links on this page resolve against. Development and the browser already know their
 * own origin; a production build renders in the prerenderer, so the published origin of the page
 * being rendered has to be named here instead of inferred from the request.
 */
function publicOrigin(siteUrl: string, product: ProductSubdomain | undefined) {
	if (import.meta.env.DEV) return undefined;
	return product ? productOrigin(product, siteUrl) : siteUrl;
}

function RootComponent() {
	const { site, grievanceOfficer, year } = Route.useLoaderData();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const product = productForPath(pathname);

	// A product is served from its own subdomain, where the company's navigation would lead off-site.
	const shell = product ? (
		<ProductShell
			name={products[product].label}
			home={`/${product}`}
			company={{ name: site.shortName, legalName: site.legalName }}
			year={year}
		>
			<Outlet />
		</ProductShell>
	) : (
		<SiteShell site={site} grievanceOfficer={grievanceOfficer} year={year}>
			<Outlet />
		</SiteShell>
	);

	return (
		<PublicOriginProvider value={publicOrigin(site.url, product)}>{shell}</PublicOriginProvider>
	);
}
