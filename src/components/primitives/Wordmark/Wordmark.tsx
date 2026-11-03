import { cn } from "#/lib/tv";

/** The stacked KYBERNETIC / SYSTEMS wordmark. */
export function Wordmark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"flex flex-col font-mono text-mono-sm leading-none tracking-wordmark uppercase",
				className,
			)}
		>
			<span className="text-fg">Kybernetic</span>
			<span className="mt-1 text-accent">Systems</span>
		</span>
	);
}
