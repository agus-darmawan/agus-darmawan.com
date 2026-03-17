"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { BlogCard } from "./BlogCard";
import { BLOG_POSTS } from "./blog.data";
import type { BlogPost } from "./types/blog.types";

interface BlogListProps {
	query: string;
	activeTags: string[];
	onQueryChange: (q: string) => void;
	onSelect: (post: BlogPost) => void;
}

export function BlogList({
	query,
	activeTags,
	onQueryChange,
	onSelect,
}: BlogListProps) {
	const t = useTranslations("BlogWindow");
	const published = BLOG_POSTS.filter((p) => p.published);

	const filtered = useMemo(() => {
		return published.filter((post) => {
			const matchesTags =
				activeTags.length === 0 ||
				activeTags.every((tag) => post.tags.includes(tag));

			if (!query.trim()) return matchesTags;

			const q = query.toLowerCase();
			const tTitle = t(`${post.i18nKey}.title`).toLowerCase();
			const tDesc = t(`${post.i18nKey}.description`).toLowerCase();
			const matchesQuery =
				tTitle.includes(q) ||
				tDesc.includes(q) ||
				post.tags.some((tag) => tag.toLowerCase().includes(q));

			return matchesTags && matchesQuery;
		});
	}, [published, query, activeTags, t]);

	return (
		<div className="flex-1 overflow-auto flex flex-col min-h-0">
			{/* Search bar */}
			<div
				className="px-5 py-3 border-b shrink-0"
				style={{ borderColor: "var(--border)" }}
			>
				<div className="relative">
					<Search
						size={12}
						className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
						style={{ color: "var(--text-muted)" }}
					/>
					<input
						type="text"
						placeholder={t("searchPlaceholder")}
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						className="w-full pl-8 py-1.5 rounded-lg text-xs font-[inherit]"
						style={{
							paddingRight: query ? "28px" : "10px",
							background: "var(--surface-secondary)",
							border: "1px solid var(--border)",
							outline: "none",
							boxShadow: "none",
							color: "var(--text-primary)",
						}}
						onFocus={(e) => {
							e.currentTarget.style.borderColor = "rgba(233,84,32,0.4)";
						}}
						onBlur={(e) => {
							e.currentTarget.style.borderColor = "var(--border)";
						}}
					/>
					{query && (
						<button
							title="Clear"
							type="button"
							onClick={() => onQueryChange("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2"
							style={{ color: "var(--text-muted)" }}
						>
							<X size={11} />
						</button>
					)}
				</div>
			</div>

			{/* Posts */}
			<div className="flex-1 overflow-auto px-5 py-4">
				<div className="flex items-center gap-2 mb-3">
					<span
						className="text-[10px] font-semibold uppercase tracking-widest"
						style={{ color: "var(--text-muted)" }}
					>
						{t("latestPosts")}
					</span>
					<div
						className="flex-1 h-px"
						style={{ background: "var(--border)" }}
					/>
					<span
						className="text-[10px] tabular-nums"
						style={{ color: "var(--text-muted)" }}
					>
						{filtered.length}
					</span>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-2xl mb-2">🔍</p>
						<p className="text-sm" style={{ color: "var(--text-muted)" }}>
							{t("noResults")}
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{filtered.map((post) => (
							<BlogCard key={post.slug} post={post} onClick={onSelect} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
