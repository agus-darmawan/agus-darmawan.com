"use client";

import { useMemo, useState } from "react";
import { BlogDetail } from "./BlogDetail";
import { BlogHeader } from "./BlogHeader";
import { BlogList } from "./BlogList";
import { BLOG_POSTS } from "./blog.data";
import type { BlogPost } from "./types/blog.types";

export default function BlogWindow() {
	const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
	const [query, setQuery] = useState("");
	const [activeTags, setActiveTags] = useState<string[]>([]);

	const allTags = useMemo(
		() =>
			Array.from(
				new Set(BLOG_POSTS.filter((p) => p.published).flatMap((p) => p.tags)),
			),
		[],
	);

	const handleTagToggle = (tag: string) => {
		setActiveTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);
	};

	const handleSelect = (post: BlogPost) => {
		setSelectedPost(post);
		// reset filter state when opening a post
		setQuery("");
		setActiveTags([]);
	};

	const handleBack = () => {
		setSelectedPost(null);
	};

	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{selectedPost ? (
				// Detail view — BlogDetail has its own back button, no header needed
				<BlogDetail post={selectedPost} onBack={handleBack} />
			) : (
				// List view — header has tag filter, list has search
				<>
					<BlogHeader
						totalTags={allTags}
						activeTags={activeTags}
						onTagToggle={handleTagToggle}
					/>
					<BlogList
						query={query}
						activeTags={activeTags}
						onQueryChange={setQuery}
						onSelect={handleSelect}
					/>
				</>
			)}
		</div>
	);
}
