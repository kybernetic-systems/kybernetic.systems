import { useLocation, useRouter } from "@tanstack/react-router";
import type { MouseEvent, ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

import { VisuallyHidden } from "#/components/primitives/VisuallyHidden/VisuallyHidden";
import { isExternalHref, isInternalHref, isWithin } from "#/lib/href";
import { usePublicOrigin } from "#/lib/origin";
import { publicHref } from "#/lib/subdomain";
import { tv } from "#/lib/tv";

const link = tv({
	base: "transition-colors",
	variants: {
		variant: {
			plain: "",
			inline:
				"text-accent underline decoration-decor/60 decoration-1 underline-offset-4 hover:text-fg hover:decoration-fg",
			underline: "border-b border-decor/50 pb-0.5 hover:border-decor hover:text-accent",
			nav: "hover:text-accent",
			footer: "text-fg-muted hover:text-accent",
		},
	},
	defaultVariants: { variant: "inline" },
});

export type LinkProps = VariantProps<typeof link> & {
	href: string;
	/**
	 * How the link marks itself as the current page with `aria-current`. `within` also marks it on
	 * pages below `href`, e.g. Blog while reading a post.
	 */
	current?: "exact" | "within" | "none";
	/** Opens an external link in a new tab, announced to screen readers. */
	newTab?: boolean;
	id?: string | undefined;
	className?: string | undefined;
	children: ReactNode;
	onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
	return event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

/**
 * The one link component. Internal paths navigate on the client; `mailto:`, `tel:`, files and
 * external URLs are ordinary links. Every link is a real `<a href>`, so it works before hydration.
 *
 * Internal paths are written as if one host served the whole site. A path that actually lives on a
 * sibling subdomain is resolved to an absolute URL against the current origin, so the same `/`
 * links reach `kybernetic.systems` in production and `localhost:3000` in development, and
 * `/mangrove` reaches the matching `mangrove.` host of whichever of the two it is.
 */
export function Link({
	href,
	variant,
	current = "exact",
	newTab = false,
	id,
	className,
	children,
	onClick,
}: LinkProps) {
	const router = useRouter();
	const { pathname } = useLocation();
	const origin = usePublicOrigin();
	const internal = isInternalHref(href);
	const path = href.split(/[?#]/u)[0] ?? href;
	// `href` is the internal path; `resolved` is what the page actually links to from this origin.
	const resolved = internal ? publicHref(href, origin) : href;
	const crossOrigin = isExternalHref(resolved);

	let ariaCurrent: "page" | "true" | undefined;
	if (internal && current !== "none") {
		if (pathname === path) {
			ariaCurrent = "page";
		} else if (current === "within" && isWithin(pathname, path)) {
			ariaCurrent = "true";
		}
	}

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		onClick?.(event);
		// A sibling subdomain is a different origin, so the browser has to load it.
		if (!internal || crossOrigin || event.defaultPrevented || isModifiedClick(event)) return;
		event.preventDefault();
		void router.navigate({ href: resolved });
	};

	const opensTab = crossOrigin && newTab;

	return (
		<a
			id={id}
			href={resolved}
			aria-current={ariaCurrent}
			target={opensTab ? "_blank" : undefined}
			rel={opensTab ? "noopener noreferrer" : undefined}
			className={link({ variant, className })}
			onClick={handleClick}
		>
			{children}
			{opensTab && <VisuallyHidden> (opens in a new tab)</VisuallyHidden>}
		</a>
	);
}
