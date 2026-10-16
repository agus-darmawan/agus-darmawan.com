"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { StatsScope } from "@/components/content/stats/ItemStats";
import type { BlogMeta } from "@/lib/content/types";
import { itemKey } from "@/lib/meta/keys";
import { cn } from "@/lib/utils";
import { PostRow } from "./PostRow";
import { matches, SearchField } from "./SearchField";

/** Below this many posts a filter only gets in the way. */
const FILTER_FROM = 4;
const MAX_TAGS = 8;

/** All posts, newest first, with a tag filter and a search once there are enough. */
export function PostIndex({ posts }: { posts: BlogMeta[] }) {
	const t = useTranslations("Content");
	const site = useTranslations("Site.writing");
	const [tag, setTag] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const keys = useMemo(() => posts.map(itemKey), [posts]);

	// The most used tags first.
	const tags = useMemo(() => {
		const counts = new Map<string, number>();
		for (const post of posts) {
			for (const name of post.tags)
				counts.set(name, (counts.get(name) ?? 0) + 1);
		}
		return [...counts]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.slice(0, MAX_TAGS)
			.map(([name]) => name);
	}, [posts]);

	const visible = posts.filter(
		(p) => (!tag || p.tags.includes(tag)) && matches(p, query),
	);

	return (
		<StatsScope items={keys}>
			{posts.length >= FILTER_FROM && (
				<div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
					<fieldset className="flex flex-wrap gap-2">
						<legend className="sr-only">{site("filter")}</legend>
						{[null, ...tags].map((value) => {
							const active = value === tag;
							return (
								<button
									key={value ?? "all"}
									type="button"
									aria-pressed={active}
									onClick={() => setTag(value)}
									className={cn(
										"inline-flex h-8 items-center rounded-full border px-3.5 text-[0.8125rem] transition-colors",
										active
											? "border-transparent bg-(--site-primary) text-(--site-on-primary)"
											: "border-(--site-line) text-(--site-text) hover:border-(--site-ink)",
									)}
								>
									{value ?? t("category.all")}
								</button>
							);
						})}
					</fieldset>
					<SearchField
						value={query}
						onChange={setQuery}
						label={site("search")}
					/>
				</div>
			)}

			{visible.length > 0 ? (
				<ul className="border-t border-(--site-line)">
					{visible.map((post) => (
						<li key={post.slug} className="border-b border-(--site-line)">
							<PostRow post={post} />
						</li>
					))}
				</ul>
			) : (
				<p className="border-t border-(--site-line) py-10 text-(--site-muted)">
					{site("noMatch", { query: query.trim() })}
				</p>
			)}
		</StatsScope>
	);
}
