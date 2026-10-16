"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ContentMeta } from "@/lib/content/types";

/** Whether an item's title, summary or tags contain the query. */
export function matches(item: ContentMeta, query: string) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return [item.title, item.description, ...item.tags].some((text) =>
		text.toLowerCase().includes(q),
	);
}

/** The search box of the project and post lists. */
export function SearchField({
	value,
	onChange,
	label,
}: {
	value: string;
	onChange: (value: string) => void;
	/** Also the placeholder: "Search projects". */
	label: string;
}) {
	const t = useTranslations("Content");

	return (
		<div className="relative w-full sm:w-64">
			<Search
				aria-hidden="true"
				className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-(--site-muted)"
			/>
			<input
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				aria-label={label}
				placeholder={label}
				className="h-9 w-full rounded-full border border-(--site-field) bg-transparent pl-10 pr-9 text-[0.875rem] text-(--site-ink) transition-colors placeholder:text-(--site-muted) hover:border-(--site-ink) [&::-webkit-search-cancel-button]:hidden"
			/>
			{value && (
				<button
					type="button"
					aria-label={t("clearSearch")}
					onClick={() => onChange("")}
					className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-(--site-muted) hover:text-(--site-ink)"
				>
					<X aria-hidden="true" className="size-3.5" />
				</button>
			)}
		</div>
	);
}
