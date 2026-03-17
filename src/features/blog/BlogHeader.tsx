"use client";

import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { BLOG_POSTS } from "./blog.data";

export function BlogHeader() {
	const t = useTranslations("BlogWindow");
	const published = BLOG_POSTS.filter((p) => p.published).length;

	return (
		<div
			className="px-5 pt-5 pb-4 border-b shrink-0 relative overflow-hidden"
			style={{ borderColor: "var(--border)" }}
		>
			{/* Accent line */}
			<div
				className="absolute top-0 left-0 right-0 h-0.5"
				style={{
					background: "linear-gradient(90deg, #e95420, #e9542060, transparent)",
				}}
			/>

			<div className="flex items-center gap-2 mb-0.5">
				<div className="w-7 h-7 rounded-lg bg-ubuntu-orange flex items-center justify-center">
					<BookOpen size={13} className="text-white" />
				</div>
				<h1
					className="text-base font-bold"
					style={{ color: "var(--text-primary)" }}
				>
					{t("title")}
				</h1>
			</div>
			<p className="text-xs ml-9" style={{ color: "var(--text-muted)" }}>
				{t("subtitle", { count: published })}
			</p>
		</div>
	);
}
