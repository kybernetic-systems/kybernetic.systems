import { expect } from "storybook/test";

/** Structural accessibility checks for a full page, beyond what axe covers. */
export async function expectWellFormedPage(root: HTMLElement) {
	await expect(root.querySelectorAll("h1")).toHaveLength(1);
	await expect(root.querySelector("header")).toBeInTheDocument();
	await expect(root.querySelector("main#main")).toBeInTheDocument();
	await expect(root.querySelector("footer")).toBeInTheDocument();

	// Headings may go back up any number of levels, but never skip a level going down.
	const levels = [...root.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")]
		.filter((heading) => !heading.closest("dialog:not([open])"))
		.map((heading) => Number(heading.tagName.slice(1)));
	const skips = levels.flatMap((level, index) => {
		const previous = levels[index - 1];
		return previous !== undefined && level - previous > 1 ? [`h${previous} → h${level}`] : [];
	});
	await expect(skips).toEqual([]);

	// WCAG 1.4.10: no horizontal scrolling, down to 320px wide.
	await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
}
