"use client";

import { useTranslations } from "next-intl";
import { BlogCard } from "./BlogCard";
import { BLOG_POSTS } from "./blog.data";
import type { BlogPost } from "./types/blog.types";

interface BlogListProps {
	onSelect: (post: BlogPost) => void;
}

export function BlogList({ onSelect }: BlogListProps) {
	const t = useTranslations("BlogWindow");
	const published = BLOG_POSTS.filter((p) => p.published);

	return (
		<div className="flex-1 overflow-auto px-5 py-4">
			{/* Section label */}
			<div className="flex items-center gap-2 mb-3">
				<span
					className="text-[10px] font-semibold uppercase tracking-widest"
					style={{ color: "var(--text-muted)" }}
				>
					{t("latestPosts")}
				</span>
				<div className="flex-1 h-px" style={{ background: "var(--border)" }} />
			</div>

			<div className="space-y-3">
				{published.map((post) => (
					<BlogCard key={post.slug} post={post} onClick={onSelect} />
				))}
			</div>
		</div>
	);
}
