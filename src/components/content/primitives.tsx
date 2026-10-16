import { Calendar, Clock, GitFork, Star, Tag as TagIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small, stateless building blocks shared by project & blog UIs.
 * They read the accent from a `--accent` CSS variable (see `accentStyle`)
 * instead of mutating `element.style` in onMouseEnter/onMouseLeave.
 */

export const accentStyle = (color: string) =>
	({ "--accent": color }) as CSSProperties;

export function Chip({
	children,
	variant = "accent",
	icon,
	className,
}: {
	children: ReactNode;
	variant?: "accent" | "muted";
	icon?: boolean;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium",
				variant === "accent"
					? "bg-(--accent)/10 text-(--accent) border border-(--accent)/20"
					: "bg-(--window-bg) text-(--text-muted) border border-(--border)",
				className,
			)}
		>
			{icon && <TagIcon size={8} aria-hidden="true" />}
			{children}
		</span>
	);
}

export function TagList({
	tags,
	max,
	moreLabel,
	variant,
	icon,
	className,
}: {
	tags: string[];
	max?: number;
	moreLabel?: (count: number) => string;
	variant?: "accent" | "muted";
	icon?: boolean;
	className?: string;
}) {
	if (tags.length === 0) return null;
	const visible = max ? tags.slice(0, max) : tags;
	const hidden = tags.length - visible.length;
	return (
		<ul className={cn("flex flex-wrap gap-1.5", className)}>
			{visible.map((tag) => (
				<li key={tag}>
					<Chip variant={variant} icon={icon}>
						{tag}
					</Chip>
				</li>
			))}
			{hidden > 0 && moreLabel && (
				<li className="text-[10px] px-1 py-0.5 text-(--text-muted)">
					{moreLabel(hidden)}
				</li>
			)}
		</ul>
	);
}

export interface MetaRowLabels {
	date?: string;
	readTime?: string;
	stars?: string;
	forks?: string;
}

export function MetaRow({
	dateIso,
	labels,
	className,
	children,
}: {
	dateIso?: string | null;
	labels: MetaRowLabels;
	className?: string;
	/** More pairs after the built-in ones (views and likes). */
	children?: ReactNode;
}) {
	const items = [
		labels.date && dateIso && (
			<time key="d" dateTime={dateIso} className="flex items-center gap-1">
				<Calendar size={10} aria-hidden="true" />
				{labels.date}
			</time>
		),
		labels.readTime && (
			<span key="r" className="flex items-center gap-1">
				<Clock size={10} aria-hidden="true" />
				{labels.readTime}
			</span>
		),
		labels.stars && (
			<span key="s" className="flex items-center gap-1">
				<Star size={10} aria-hidden="true" />
				{labels.stars}
			</span>
		),
		labels.forks && (
			<span key="f" className="flex items-center gap-1">
				<GitFork size={10} aria-hidden="true" />
				{labels.forks}
			</span>
		),
	].filter(Boolean);

	if (items.length === 0 && !children) return null;
	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-3 text-[10px] text-(--text-muted)",
				className,
			)}
		>
			{items}
			{children}
		</div>
	);
}
