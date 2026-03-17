"use client";

import { useState } from "react";
import { BlogDetail } from "./BlogDetail";
import { BlogHeader } from "./BlogHeader";
import { BlogList } from "./BlogList";
import type { BlogPost } from "./types/blog.types";

export default function BlogWindow() {
	const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{selectedPost ? (
				<BlogDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
			) : (
				<>
					<BlogHeader />
					<BlogList onSelect={setSelectedPost} />
				</>
			)}
		</div>
	);
}
