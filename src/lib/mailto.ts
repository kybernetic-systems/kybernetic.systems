export type MailtoOptions = {
	to: string;
	subject?: string | undefined;
	body?: string | undefined;
};

/**
 * Builds a `mailto:` URL. Uses `encodeURIComponent`, so spaces become `%20`: many mail clients show
 * a `+` from form-style encoding literally.
 */
export function mailto({ to, subject, body }: MailtoOptions): string {
	const query = [
		subject ? `subject=${encodeURIComponent(subject)}` : undefined,
		body ? `body=${encodeURIComponent(body)}` : undefined,
	].filter((part) => part !== undefined);
	return query.length > 0 ? `mailto:${to}?${query.join("&")}` : `mailto:${to}`;
}
