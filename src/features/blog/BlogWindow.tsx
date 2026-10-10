"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ContentDetail } from "@/components/content/ContentDetail";
import { useContent } from "@/components/content/ContentProvider";
import { WindowHero } from "@/components/window/WindowHero";
import type { BlogMeta } from "@/lib/content/types";
import { BlogList } from "./BlogList";

export default function BlogWindow() {
	const t = useTranslations("BlogWindow");
	const tc = useTranslations("Content");
	const { posts } = useContent();
	const [selected, setSelected] = useState<BlogMeta | null>(null);
	const [query, setQuery] = useState("");
	const [activeTags, setActiveTags] = useState<string[]>([]);

	const allTags = useMemo(
		() => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
		[posts],
	);

	const toggleTag = (tag: string) =>
		setActiveTags((prev) =>
			prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
		);

	if (selected) {
		return (
			<ContentDetail
				item={selected}
				leading={
					<button
						type="button"
						onClick={() => setSelected(null)}
						className="flex items-center gap-1.5 text-xs mb-3 transition-opacity hover:opacity-70 text-(--text-muted)"
					>
						<ArrowLeft size={12} aria-hidden="true" />
						{tc("backToBlog")}
					</button>
				}
			/>
		);
	}

	return (
		<div className="h-full flex flex-col bg-(--window-bg) text-(--text-primary)">
			<WindowHero
				accent="#e95420"
				accentTo="#77216f"
				decoration="hatch"
				icon={<BookOpen size={15} className="text-white" />}
				title={t("title")}
				subtitle={t("subtitle", { count: posts.length })}
				description={t("headerDesc")}
			>
				{allTags.length > 0 && (
					<>
						<div className="flex items-center gap-2 mb-2.5">
							<span className="text-[9px] font-semibold uppercase tracking-widest shrink-0 text-(--text-muted)">
								{t("filterHint")}
							</span>
							<div className="flex-1 h-px bg-linear-to-r from-(--border) to-transparent" />
						</div>
						<div className="flex flex-wrap gap-1.5">
							{allTags.map((tag) => {
								const active = activeTags.includes(tag);
								return (
									<button
										key={tag}
										type="button"
										aria-pressed={active}
										onClick={() => toggleTag(tag)}
										className={
											active
												? "text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-all duration-150 text-white border border-[#e95420] bg-linear-to-br from-[#e95420] to-[#c0392b] shadow-[0_2px_8px_rgba(233,84,32,0.3)]"
												: "text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-all duration-150 bg-(--surface-secondary) text-(--text-muted) border border-(--border)"
										}
									>
										{tag}
									</button>
								);
							})}
						</div>
					</>
				)}
			</WindowHero>

			<BlogList
				posts={posts}
				query={query}
				activeTags={activeTags}
				onQueryChange={setQuery}
				onSelect={(post) => {
					setSelected(post);
					setQuery("");
					setActiveTags([]);
				}}
			/>
		</div>
	);
}
