"use client";

import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BlogPost } from "./types/blog.types";

interface BlogCardProps {
	post: BlogPost;
	onClick: (post: BlogPost) => void;
}

export function BlogCard({ post, onClick }: BlogCardProps) {
	const t = useTranslations("Blog");
	const tWindow = useTranslations("BlogWindow");

	const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<button
			type="button"
			onClick={() => onClick(post)}
			className="w-full text-left rounded-2xl overflow-hidden border transition-all duration-200 group relative"
			style={{
				background: "var(--surface-secondary)",
				borderColor: "var(--border)",
			}}
			onMouseEnter={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = `${post.color}50`;
				el.style.transform = "translateY(-2px)";
				el.style.boxShadow = `0 8px 24px ${post.color}18`;
			}}
			onMouseLeave={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = "var(--border)";
				el.style.transform = "none";
				el.style.boxShadow = "none";
			}}
		>
			{/* Top accent bar */}
			<div
				className="h-0.5 w-full"
				style={{
					background: `linear-gradient(90deg, ${post.color}, ${post.color}40)`,
				}}
			/>

			{/* Hover glow */}
			<div
				className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
				style={{
					background: `radial-gradient(ellipse at top left, ${post.color}08 0%, transparent 60%)`,
				}}
			/>

			<div className="relative p-4">
				{/* Top row */}
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-start gap-3">
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform duration-200 group-hover:scale-110"
							style={{
								background: `${post.color}18`,
								border: `1px solid ${post.color}28`,
							}}
						>
							{post.emoji}
						</div>
						<div className="min-w-0">
							<h2
								className="font-semibold text-sm leading-snug"
								style={{ color: "var(--text-primary)" }}
							>
								{t(`${post.i18nKey}.title`)}
							</h2>
							<p
								className="text-[11px] mt-0.5 line-clamp-2 leading-relaxed"
								style={{ color: "var(--text-secondary)" }}
							>
								{t(`${post.i18nKey}.description`)}
							</p>
						</div>
					</div>

					{/* Arrow on hover */}
					<div
						className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						style={{ background: `${post.color}18`, color: post.color }}
					>
						<ArrowUpRight size={12} />
					</div>
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-1.5 mb-3">
					{post.tags.map((tag) => (
						<span
							key={tag}
							className="text-[10px] px-2 py-0.5 rounded-full font-medium"
							style={{
								background: `${post.color}12`,
								color: post.color,
								border: `1px solid ${post.color}28`,
							}}
						>
							{tag}
						</span>
					))}
				</div>

				{/* Meta */}
				<div
					className="flex items-center gap-3 text-[10px]"
					style={{ color: "var(--text-muted)" }}
				>
					<span className="flex items-center gap-1">
						<Calendar size={10} />
						{formattedDate}
					</span>
					<span className="flex items-center gap-1">
						<Clock size={10} />
						{tWindow("readTime", { min: post.readTime })}
					</span>
				</div>
			</div>
		</button>
	);
}
