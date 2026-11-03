import { useId, useRef, useState } from "react";

import { Link } from "#/components/primitives/Link/Link";
import { Logo } from "#/components/primitives/Logo/Logo";
import { Wordmark } from "#/components/primitives/Wordmark/Wordmark";

export type NavItem = { label: string; href: string };

export type MobileMenuProps = {
	items: NavItem[];
	className?: string | undefined;
};

/**
 * Navigation for narrow screens. A native modal `<dialog>` provides focus containment, Escape to
 * close, an inert page behind it, and returns focus to the button when it closes.
 */
export function MobileMenu({ items, className }: MobileMenuProps) {
	const dialog = useRef<HTMLDialogElement>(null);
	const [open, setOpen] = useState(false);
	const id = useId();
	const titleId = `${id}-title`;

	const show = () => {
		dialog.current?.showModal();
		setOpen(true);
	};
	const close = () => dialog.current?.close();

	return (
		<div className={className}>
			<button
				type="button"
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={id}
				onClick={show}
				className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 font-mono text-mono-sm tracking-label text-fg uppercase"
			>
				<MenuIcon />
				Menu
			</button>
			<dialog
				ref={dialog}
				id={id}
				aria-labelledby={titleId}
				onClose={() => setOpen(false)}
				className="m-0 h-dvh max-h-none w-full max-w-none bg-surface p-0 text-fg backdrop:bg-navy/40 open:flex open:flex-col"
			>
				<div className="flex h-header items-center justify-between border-b border-rule px-gutter">
					<span className="flex items-center gap-3.5">
						<Logo decorative className="size-8" />
						<Wordmark />
					</span>
					<button
						type="button"
						onClick={close}
						className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 font-mono text-mono-sm tracking-label text-fg uppercase"
					>
						<CloseIcon />
						Close
					</button>
				</div>
				<nav aria-labelledby={titleId} className="flex-1 overflow-y-auto px-gutter py-10">
					<h2 id={titleId} className="sr-only">
						Menu
					</h2>
					<ul className="m-0 grid list-none gap-1 p-0">
						{items.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									variant="nav"
									current="within"
									onClick={close}
									className="flex min-h-12 items-center border-b border-rule py-3 font-serif text-heading-md aria-[current]:text-accent"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</dialog>
		</div>
	);
}

function MenuIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 20 20"
			className="size-5"
			fill="none"
			stroke="currentColor"
		>
			<path d="M3 6h14M3 10h14M3 14h14" strokeWidth="1.25" />
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 20 20"
			className="size-5"
			fill="none"
			stroke="currentColor"
		>
			<path d="M5 5l10 10M15 5L5 15" strokeWidth="1.25" />
		</svg>
	);
}
