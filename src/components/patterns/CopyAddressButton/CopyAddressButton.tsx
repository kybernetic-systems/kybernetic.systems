import { useState } from "react";

import { cn } from "#/lib/tv";

export type CopyAddressButtonProps = {
	address: string;
	className?: string | undefined;
};

type Status = "idle" | "copied" | "failed";

const messages: Record<Status, string> = {
	idle: "",
	copied: "Address copied",
	failed: "Couldn't copy; select the address instead",
};

/**
 * Copies an email address, for visitors whose browser has no mail app to open. The address is
 * always shown as text beside it too.
 */
export function CopyAddressButton({ address, className }: CopyAddressButtonProps) {
	const [status, setStatus] = useState<Status>("idle");

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(address);
			setStatus("copied");
		} catch {
			setStatus("failed");
		}
	};

	return (
		<span className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
			<button
				type="button"
				onClick={() => void copy()}
				className="inline-flex min-h-11 items-center font-mono text-mono-xs tracking-label text-accent uppercase underline decoration-decor/60 underline-offset-4 hover:text-fg"
			>
				Copy address
			</button>
			<output aria-live="polite" className="font-mono text-mono-xs tracking-meta text-fg-muted">
				{messages[status]}
			</output>
		</span>
	);
}
