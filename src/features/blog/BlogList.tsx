"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ContentCard } from "@/components/content/ContentCard";
import type { BlogMeta, ContentMeta } from "@/lib/content/types";

interface BlogListProps {
	posts: BlogMeta[];
	query: string;
	activeTags: string[];
	onQueryChange: (q: string) => void;
	onSelect: (post: BlogMeta) => void;
}

export function BlogList({
	posts,
	query,
	activeTags,
	onQueryChange,
	onSelect,
}: BlogListProps) {
	const t = useTranslations("BlogWindow");

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return posts.filter((post) => {
			const matchesTags = activeTags.every((tag) => post.tags.includes(tag));
			if (!matchesTags || !q) return matchesTags;
			return [post.title, post.description, ...post.tags].some((s) =>
				s.toLowerCase().includes(q),
			);
		});
	}, [posts, query, activeTags]);

	return (
		<div className="flex-1 overflow-auto flex flex-col min-h-0">
			<div className="px-5 py-3 border-b shrink-0 border-(--border)">
				<div className="relative">
					<Search
						size={12}
						aria-hidden="true"
						className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-muted)"
					/>
					<input
						type="search"
						aria-label={t("searchPlaceholder")}
						placeholder={t("searchPlaceholder")}
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						className="w-full pl-8 py-1.5 rounded-lg text-xs font-[inherit] outline-none bg-(--surface-secondary) border border-(--border) text-(--text-primary) focus:border-[#e95420]/40"
						style={{ paddingRight: query ? 28 : 10 }}
					/>
					{query && (
						<button
							aria-label="Clear"
							type="button"
							onClick={() => onQueryChange("")}
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
						{t("latestPosts")}
					</span>
					<div className="flex-1 h-px bg-(--border)" />
					<span className="text-[10px] tabular-nums text-(--text-muted)">
						{filtered.length}
					</span>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-2xl mb-2" aria-hidden="true">
							🔍
						</p>
						<p className="text-sm text-(--text-muted)">{t("noResults")}</p>
					</div>
				) : (
					<ul className="space-y-3">
						{filtered.map((post) => (
							<li key={post.slug}>
								<ContentCard
									item={post}
									onOpen={(item: ContentMeta) => onSelect(item as BlogMeta)}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
