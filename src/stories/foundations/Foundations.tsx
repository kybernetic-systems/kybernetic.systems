import type { ReactNode } from "react";

import { contrastRatio, mix, parseHex, wcagLevel } from "#/lib/contrast";
import type { Rgb } from "#/lib/contrast";

/** Brand palette, mirrored from `src/styles/theme.css`. */
export const palette = {
	"navy": "#0a1a3a",
	"paper": "#f7f4ed",
	"brass": "#a37e44",
	"brass-deep": "#8a6934",
	"brass-light": "#b8925a",
	"slate": "#2a3550",
	"stone": "#6b6357",
} as const;

const rgb = {
	"navy": parseHex(palette.navy),
	"paper": parseHex(palette.paper),
	"brass": parseHex(palette.brass),
	"brass-deep": parseHex(palette["brass-deep"]),
	"brass-light": parseHex(palette["brass-light"]),
	"slate": parseHex(palette.slate),
	"stone": parseHex(palette.stone),
};

type Pair = { token: string; use: string; foreground: Rgb; background: Rgb; minimum: number };

/** Every text/background pairing the semantic tokens produce, per tone. */
export const pairs: Record<"paper" | "ink", Pair[]> = {
	paper: [
		{
			token: "fg",
			use: "Headings, primary text",
			foreground: rgb.navy,
			background: rgb.paper,
			minimum: 4.5,
		},
		{
			token: "fg-body",
			use: "Long-form body",
			foreground: rgb.slate,
			background: rgb.paper,
			minimum: 4.5,
		},
		{
			token: "fg-muted / fg-subtle",
			use: "Meta, captions",
			foreground: rgb.stone,
			background: rgb.paper,
			minimum: 4.5,
		},
		{
			token: "accent",
			use: "Eyebrows, small accent text",
			foreground: rgb["brass-deep"],
			background: rgb.paper,
			minimum: 4.5,
		},
		{
			token: "decor",
			use: "Rules, arrows (non-text, 3:1)",
			foreground: rgb.brass,
			background: rgb.paper,
			minimum: 3,
		},
		{
			token: "fg-muted on tint",
			use: "Chips",
			foreground: rgb.stone,
			background: mix(rgb.brass, rgb.paper, 0.1),
			minimum: 4.5,
		},
		{
			token: "ButtonLink ink",
			use: "Paper on navy",
			foreground: rgb.paper,
			background: rgb.navy,
			minimum: 4.5,
		},
		{
			token: "ButtonLink hover",
			use: "Navy on brass",
			foreground: rgb.navy,
			background: rgb.brass,
			minimum: 4.5,
		},
	],
	ink: [
		{
			token: "fg",
			use: "Headings, primary text",
			foreground: rgb.paper,
			background: rgb.navy,
			minimum: 4.5,
		},
		{
			token: "fg-body",
			use: "Long-form body (paper 78%)",
			foreground: mix(rgb.paper, rgb.navy, 0.78),
			background: rgb.navy,
			minimum: 4.5,
		},
		{
			token: "fg-muted",
			use: "Secondary text (paper 72%)",
			foreground: mix(rgb.paper, rgb.navy, 0.72),
			background: rgb.navy,
			minimum: 4.5,
		},
		{
			token: "fg-subtle",
			use: "Legal strip, notes (paper 50%)",
			foreground: mix(rgb.paper, rgb.navy, 0.5),
			background: rgb.navy,
			minimum: 4.5,
		},
		{
			token: "accent",
			use: "Eyebrows, small accent text",
			foreground: rgb.brass,
			background: rgb.navy,
			minimum: 4.5,
		},
		{
			token: "fg-muted on tint",
			use: "Chips",
			foreground: mix(rgb.paper, rgb.navy, 0.72),
			background: mix(rgb.brass, rgb.navy, 0.14),
			minimum: 4.5,
		},
		{
			token: "ButtonLink brass",
			use: "Navy on brass",
			foreground: rgb.navy,
			background: rgb.brass,
			minimum: 4.5,
		},
		{
			token: "ButtonLink hover",
			use: "Navy on brass-light",
			foreground: rgb.navy,
			background: rgb["brass-light"],
			minimum: 4.5,
		},
	],
};

const css = ([red, green, blue]: Rgb) => `rgb(${red} ${green} ${blue})`;

const swatches = Object.entries(palette).map(([name, hex]) => ({
	name,
	hex,
	style: { backgroundColor: hex },
}));

const rows = (tone: "paper" | "ink") =>
	pairs[tone].map((pair) => ({
		token: pair.token,
		use: pair.use,
		minimum: pair.minimum,
		ratio: contrastRatio(pair.foreground, pair.background),
		style: { color: css(pair.foreground), backgroundColor: css(pair.background) },
	}));

const contrastRows = { paper: rows("paper"), ink: rows("ink") };

export function PaletteSwatches() {
	return (
		<ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-0">
			{swatches.map(({ name, hex, style }) => (
				<li key={name} className="border border-rule-strong">
					<div className="h-20" style={style} />
					<p className="m-0 p-3 font-mono text-mono-sm">
						<span className="block font-medium">{name}</span>
						<span className="text-fg-muted">{hex}</span>
					</p>
				</li>
			))}
		</ul>
	);
}

export function ContrastTable({ tone }: { tone: "paper" | "ink" }) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse font-mono text-mono-sm">
				<caption className="sr-only">Contrast of semantic tokens on the {tone} tone</caption>
				<thead>
					<tr className="border-b border-rule-strong text-left">
						<th scope="col" className="p-2">
							Sample
						</th>
						<th scope="col" className="p-2">
							Token
						</th>
						<th scope="col" className="p-2">
							Use
						</th>
						<th scope="col" className="p-2">
							Ratio
						</th>
						<th scope="col" className="p-2">
							Level
						</th>
					</tr>
				</thead>
				<tbody>
					{contrastRows[tone].map((pair) => {
						const passes = pair.ratio >= pair.minimum;
						return (
							<tr key={pair.token} className="border-b border-rule">
								<td className="p-2">
									<span className="inline-block px-3 py-1 font-serif text-body" style={pair.style}>
										Aa
									</span>
								</td>
								<td className="p-2">{pair.token}</td>
								<td className="p-2">{pair.use}</td>
								<td className="p-2">{pair.ratio.toFixed(2)}:1</td>
								<td className="p-2">
									{passes ? "✓" : "✗"} {pair.minimum === 3 ? "Non-text" : wcagLevel(pair.ratio)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

const typeScale = [
	["display-xl", "font-serif text-display-xl", "Through Learning We Flourish"],
	["display", "font-serif text-display", "Notes on steering"],
	["statement", "font-serif text-statement", "Learn, adapt, and flourish."],
	["heading-xl", "font-serif text-heading-xl", "Nothing here fits you?"],
	["heading-lg", "font-serif text-heading-lg", "Founding Engineer"],
	["heading-md", "font-serif text-heading-md", "First principles"],
	[
		"lead",
		"font-serif text-lead",
		"We build systems that serve people and unlock human potential, so that together we may shape a better world.",
	],
	["body-lg", "font-serif text-body-lg", "The helmsman does not fight the sea. He reads it."],
	[
		"body",
		"font-serif text-body",
		"Build the smallest honest thing, put it in front of a real person.",
	],
	["body-sm", "font-serif text-body-sm", "Contact for queries & grievances."],
	["mono-note", "font-mono text-mono-note", "Last updated July 27, 2026 · Version 1.0"],
	["eyebrow", "eyebrow", "How We Work"],
	["label-mono", "label-mono text-fg-muted", "Jul 12, 2026 · Complexity"],
	["mono-xs", "font-mono text-mono-xs tracking-meta uppercase", "Opening soon"],
] as const;

export function TypeSpecimen() {
	return (
		<dl className="m-0 grid gap-6">
			{typeScale.map(([token, className, sample]) => (
				<div key={token} className="grid gap-2 border-t border-rule pt-4">
					<dt className="font-mono text-mono-xs text-fg-muted">{token}</dt>
					<dd className={`m-0 ${className}`}>{sample}</dd>
				</div>
			))}
		</dl>
	);
}

const spacing = [
	["gutter", "w-gutter", "20px → 40px"],
	["section-sm", "w-section-sm", "56px → 100px"],
	["section", "w-section", "64px → 120px"],
	["section-lg", "w-section-lg", "72px → 130px"],
	["split-gap", "w-split-gap", "24px → 90px"],
	["aside", "w-aside", "300px"],
	["header", "w-header", "64px → 76px"],
	["panel", "w-panel", "24px → 56px"],
	["panel-lg", "w-panel-lg", "28px → 62px"],
] as const;

export function SpacingScale() {
	return (
		<dl className="m-0 grid gap-3 font-mono text-mono-sm">
			{spacing.map(([token, width, range]) => (
				<div key={token} className="grid grid-cols-[8rem_1fr] items-center gap-4">
					<dt>
						{token}
						<span className="block text-fg-muted">{range}</span>
					</dt>
					<dd className="m-0">
						<span className={`block h-3 bg-decor ${width}`} />
					</dd>
				</div>
			))}
		</dl>
	);
}

const breakpoints = [
	["base", "< 640px", "Single column. Mobile menu. Stacked splits, rows and cards."],
	["sm", "≥ 640px", "Single column with more room; footer site links in two columns."],
	["md", "≥ 768px", "Inline navigation. Two-column footer, blog row with date column."],
	["lg", "≥ 1024px", "The reference desktop design: splits, three-column grids, sticky TOC."],
	["xl", "≥ 1280px", "Fluid tokens reach their maximums inside the 1160px container."],
] as const;

export function BreakpointTable() {
	return (
		<table className="w-full border-collapse font-mono text-mono-sm">
			<thead>
				<tr className="border-b border-rule-strong text-left">
					<th scope="col" className="p-2">
						Name
					</th>
					<th scope="col" className="p-2">
						Viewport
					</th>
					<th scope="col" className="p-2">
						What changes
					</th>
				</tr>
			</thead>
			<tbody>
				{breakpoints.map(([name, width, change]) => (
					<tr key={name} className="border-b border-rule">
						<td className="p-2">{name}</td>
						<td className="p-2">{width}</td>
						<td className="p-2 font-serif text-body-sm">{change}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function Demo({ label, children }: { label: string; children: ReactNode }) {
	return (
		<figure className="m-0 grid place-items-center gap-4 border border-rule p-8">
			{children}
			<figcaption className="font-mono text-mono-xs text-fg-muted">{label}</figcaption>
		</figure>
	);
}

export function MotionDemo() {
	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<Demo label="animate-rise">
				<p className="m-0 font-serif text-heading-md motion-safe:animate-rise">Rise</p>
			</Demo>
			<Demo label="animate-fade">
				<p className="m-0 font-serif text-heading-md motion-safe:animate-fade">Fade</p>
			</Demo>
			<Demo label="animate-helm (sped up here)">
				<span
					aria-hidden="true"
					className="block size-12 border-2 border-decor border-t-transparent motion-safe:animate-[spin_3s_linear_infinite_reverse]"
				/>
			</Demo>
		</div>
	);
}

export function FocusDemo() {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{(["paper", "ink"] as const).map((tone) => (
				<div key={tone} data-tone={tone} className="grid gap-4 p-8">
					<p className="m-0 eyebrow">{tone} tone</p>
					<a href="#focus" className="justify-self-start text-body underline">
						Tab to this link
					</a>
				</div>
			))}
		</div>
	);
}
