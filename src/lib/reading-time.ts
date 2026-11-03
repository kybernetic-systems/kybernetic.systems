const WORDS_PER_MINUTE = 230;

/** "6 min read", rounded up, never less than one minute. */
export function readingTime(text: string): string {
	const words = text.trim().split(/\s+/u).filter(Boolean).length;
	return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
}
