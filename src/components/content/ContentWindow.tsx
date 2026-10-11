"use client";

import { ArrowLeft, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	type CSSProperties,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	WindowHero,
	type WindowHeroProps,
} from "@/components/window/WindowHero";
import type { AppId } from "@/config/apps";
import type { ContentMeta } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { useContentSelection } from "@/store/useContentSelection";
import { ContentCard } from "./ContentCard";
import { ContentDetail } from "./ContentDetail";

interface ContentFilterOption {
	value: string;
	label: string;
	/** Pill + hero accent while this option is active. */
	color?: string;
}

export interface ContentFilter<T extends ContentMeta> {
	label: string;
	/**
	 * single — one value at a time with an "All" pill (project categories)
	 * multi  — toggle several; an item must match every selected value (tags)
	 */
	mode: "single" | "multi";
	allLabel?: string;
	options: ContentFilterOption[];
	match: (item: T, value: string) => boolean;
}

interface ContentWindowProps<T extends ContentMeta> {
	/** The window this list lives in; deep links and the website use it. */
	appId: AppId;
	items: T[];
	hero: Omit<WindowHeroProps, "children">;
	filter?: ContentFilter<T>;
	labels: { search: string; list: string; empty: string; back: string };
	emptyIcon?: string;
}

/**
 * The one window behind both Projects and Blog: hero + filters + search +
 * cards, and the selected item opens IN this window (with a back button)
 * instead of spawning another window.
 *
 * The list stays mounted while a detail is open, so going back keeps the
 * scroll position, search and filters exactly as they were.
 */
export function ContentWindow<T extends ContentMeta>({
	appId,
	items,
	hero,
	filter,
	labels,
	emptyIcon = "🔍",
}: ContentWindowProps<T>) {
	const tc = useTranslations("Content");
	const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [active, setActive] = useState<string[]>([]);
	const backRef = useRef<HTMLButtonElement>(null);

	const selected = items.find((i) => i.slug === selectedSlug) ?? null;

	// A deep link (/desktop?open=projects&item=…) picks the item to show.
	const requested = useContentSelection((s) =>
		s.requested?.app === appId ? s.requested.slug : null,
	);
	useEffect(() => {
		if (!requested) return;
		setSelectedSlug(requested);
		useContentSelection.getState().clearRequest();
	}, [requested]);

	// Publish what's on screen, so "Website" opens the same article.
	const shownSlug = selected?.slug ?? null;
	useEffect(() => {
		useContentSelection.getState().setShown(appId, shownSlug);
	}, [appId, shownSlug]);
	useEffect(
		() => () => useContentSelection.getState().setShown(appId, null),
		[appId],
	);

	// Keyboard users land on "back" when a detail opens.
	useEffect(() => {
		if (selected) backRef.current?.focus({ preventScroll: true });
	}, [selected]);

	const counts = useMemo(() => {
		const map = new Map<string, number>();
		for (const option of filter?.options ?? []) {
			map.set(
				option.value,
				items.filter((i) => filter?.match(i, option.value)).length,
			);
		}
		return map;
	}, [items, filter]);

	const visible = useMemo(() => {
		const q = query.trim().toLowerCase();
		return items.filter((item) => {
			if (filter && !active.every((v) => filter.match(item, v))) return false;
			if (!q) return true;
			return [item.title, item.description, ...item.tags].some((s) =>
				s.toLowerCase().includes(q),
			);
		});
	}, [items, filter, active, query]);

	const toggle = (value: string) => {
		if (!filter) return;
		setActive((prev) =>
			filter.mode === "single"
				? prev[0] === value
					? []
					: [value]
				: prev.includes(value)
					? prev.filter((v) => v !== value)
					: [...prev, value],
		);
	};

	// Single-select filters tint the hero with the active option's color.
	const activeColor =
		filter?.mode === "single"
			? filter.options.find((o) => o.value === active[0])?.color
			: undefined;
	const accent = activeColor ?? hero.accent;

	const pills = filter
		? [
				...(filter.mode === "single" && filter.allLabel
					? [{ value: "", label: filter.allLabel, color: hero.accent }]
					: []),
				...filter.options.filter((o) => (counts.get(o.value) ?? 0) > 0),
			]
		: [];

	return (
		<div className="h-full flex flex-col bg-(--window-bg) text-(--text-primary)">
			{selected && (
				<ContentDetail
					item={selected}
					leading={
						<button
							ref={backRef}
							type="button"
							onClick={() => setSelectedSlug(null)}
							className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 text-(--text-muted)"
						>
							<ArrowLeft size={12} aria-hidden="true" />
							{labels.back}
						</button>
					}
				/>
			)}

			{/* List — hidden (not unmounted) while a detail is open. */}
			<div
				className={cn("flex-1 min-h-0 flex-col", selected ? "hidden" : "flex")}
			>
				<WindowHero {...hero} accent={accent}>
					{pills.length > 0 && filter && (
						<>
							<div className="flex items-center gap-2 mb-2.5">
								<span className="text-[9px] font-semibold uppercase tracking-widest shrink-0 text-(--text-muted)">
									{filter.label}
								</span>
								<div className="flex-1 h-px bg-linear-to-r from-(--border) to-transparent" />
							</div>
							<div className="flex flex-wrap gap-1.5">
								{pills.map((pill) => {
									const isActive =
										pill.value === ""
											? active.length === 0
											: active.includes(pill.value);
									const color = pill.color ?? hero.accent;
									const count =
										pill.value === ""
											? items.length
											: (counts.get(pill.value) ?? 0);
									return (
										<button
											key={pill.value || "all"}
											type="button"
											aria-pressed={isActive}
											onClick={() =>
												pill.value === "" ? setActive([]) : toggle(pill.value)
											}
											style={{ "--pill": color } as CSSProperties}
											className={cn(
												"flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border",
												isActive
													? "text-white border-transparent bg-linear-to-br from-(--pill) to-(--pill)/80 shadow-[0_2px_8px_color-mix(in_srgb,var(--pill)_30%,transparent)]"
													: "bg-(--surface-secondary) text-(--text-secondary) border-(--border) hover:border-(--pill)/50",
											)}
										>
											{pill.label}
											{filter.mode === "single" && (
												<span
													className={cn(
														"text-[9px] px-1 py-0.5 rounded-full font-semibold tabular-nums",
														isActive
															? "bg-white/25 text-white"
															: "bg-(--border) text-(--text-muted)",
													)}
												>
													{count}
												</span>
											)}
										</button>
									);
								})}
							</div>
						</>
					)}
				</WindowHero>

				<div className="px-5 py-3 border-b shrink-0 border-(--border)">
					<div className="relative">
						<Search
							size={12}
							aria-hidden="true"
							className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-muted)"
						/>
						<input
							type="search"
							aria-label={labels.search}
							placeholder={labels.search}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full pl-8 py-1.5 rounded-lg text-xs font-[inherit] outline-none bg-(--surface-secondary) border border-(--border) text-(--text-primary) focus:border-[#e95420]/40 [&::-webkit-search-cancel-button]:hidden"
							style={{ paddingRight: query ? 28 : 10 }}
						/>
						{query && (
							<button
								aria-label={tc("clearSearch")}
								type="button"
								onClick={() => setQuery("")}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
							>
								<X size={11} />
							</button>
						)}
					</div>
				</div>

				<div className="flex-1 overflow-auto px-5 py-4">
					<div className="flex items-center gap-2 mb-3">
						<span className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
							{labels.list}
						</span>
						<div className="flex-1 h-px bg-(--border)" />
						<span className="text-[10px] tabular-nums text-(--text-muted)">
							{visible.length}
						</span>
					</div>

					{visible.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<p className="text-2xl mb-2" aria-hidden="true">
								{emptyIcon}
							</p>
							<p className="text-sm text-(--text-muted)">{labels.empty}</p>
						</div>
					) : (
						<ul className="grid grid-cols-1 gap-3">
							{visible.map((item) => (
								<li key={item.slug}>
									<ContentCard
										item={item}
										onOpen={(i) => setSelectedSlug(i.slug)}
									/>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
