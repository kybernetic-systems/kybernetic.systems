/** Whether an href points inside this site and should use client-side navigation. */
export function isInternalHref(href: string): boolean {
	return (
		href.startsWith("/") &&
		!href.startsWith("//") &&
		!/\.[a-z\d]+$/i.test(href.split(/[?#]/u)[0] ?? "")
	);
}

/** Whether an href opens another site. */
export function isExternalHref(href: string): boolean {
	return /^https?:\/\//i.test(href) || href.startsWith("//");
}

/** Whether `pathname` is `href` or a page below it, e.g. `/blog/post` is within `/blog`. */
export function isWithin(pathname: string, href: string): boolean {
	if (href === "/") return pathname === "/";
	const base = href.replace(/\/$/u, "");
	return pathname === base || pathname.startsWith(`${base}/`);
}
