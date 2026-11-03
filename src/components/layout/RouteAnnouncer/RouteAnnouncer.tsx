import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * After client-side navigation, moves focus to the main content and announces the new page title,
 * as a full page load would. The first load is left alone.
 */
export function RouteAnnouncer() {
	const router = useRouter();
	const [announcement, setAnnouncement] = useState("");

	useEffect(
		() =>
			router.subscribe("onResolved", (event) => {
				if (!event.pathChanged || !event.fromLocation) return;
				document.getElementById("main")?.focus({ preventScroll: true });
				// The title updates when the new route's head renders, one frame later.
				requestAnimationFrame(() => setAnnouncement(document.title));
			}),
		[router],
	);

	return (
		<output aria-live="polite" aria-atomic="true" className="sr-only">
			{announcement}
		</output>
	);
}
