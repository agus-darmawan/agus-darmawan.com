"use client";

import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ReadmeRenderer } from "@/features/projects/readme/ReadmeRenderer";
import type { BlogPost } from "./types/blog.types";

interface BlogDetailProps {
	post: BlogPost;
	onBack: () => void;
}

export function BlogDetail({ post, onBack }: BlogDetailProps) {
	const locale = useLocale();
	const t = useTranslations("Blog");
	const tWindow = useTranslations("BlogWindow");
	const scrollRef = useRef<HTMLDivElement>(null);
	const [content, setContent] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [_, setError] = useState(false);

	// Fetch MDX from Cloudflare R2 via NEXT_PUBLIC_CONTENT_URL
	// Falls back to EN if locale content not found
	// Falls back to placeholder if both fail
	useEffect(() => {
		setLoading(true);
		setContent(null);
		setError(false);

		const baseUrl = process.env.NEXT_PUBLIC_CONTENT_URL ?? "";

		const tryFetch = (url: string) =>
			fetch(url).then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.text();
			});

		tryFetch(`${baseUrl}/blog/${locale}/${post.slug}.mdx`)
			.catch(() => {
				// Locale-specific not found → try EN fallback
				if (locale !== "en") {
					return tryFetch(`${baseUrl}/blog/en/${post.slug}.mdx`);
				}
				throw new Error("not found");
			})
			.then(setContent)
			.catch(() => {
				// Both failed → show placeholder
				setError(true);
				setContent(
					`# ${t(`${post.i18nKey}.title`)}\n\n${t(`${post.i18nKey}.description`)}\n\n> ${tWindow("comingSoon")}`,
				);
			})
			.finally(() => setLoading(false));
	}, [post.slug, post.i18nKey, locale, t, tWindow]);

	const formattedDate = new Date(post.date).toLocaleDateString(
		locale === "id" ? "id-ID" : "en-US",
		{ year: "numeric", month: "long", day: "numeric" },
	);

	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)" }}
		>
			{/* Sub-header */}
			<div
				className="px-5 pt-4 pb-4 border-b shrink-0"
				style={{
					borderColor: "var(--border)",
					background: `linear-gradient(135deg, ${post.color}10 0%, transparent 60%)`,
				}}
			>
				{/* Back */}
				<button
					type="button"
					onClick={onBack}
					className="flex items-center gap-1.5 text-xs mb-3 transition-opacity hover:opacity-70"
					style={{ color: "var(--text-muted)" }}
				>
					<ArrowLeft size={12} />
					{tWindow("backToBlog")}
				</button>

				{/* Title row */}
				<div className="flex items-start gap-3">
					<div
						className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
						style={{ background: `${post.color}20` }}
					>
						{post.emoji}
					</div>
					<div className="flex-1 min-w-0">
						<h2
							className="text-sm font-bold leading-snug"
							style={{ color: "var(--text-primary)" }}
						>
							{t(`${post.i18nKey}.title`)}
						</h2>
						<p
							className="text-[11px] mt-0.5 line-clamp-2"
							style={{ color: "var(--text-muted)" }}
						>
							{t(`${post.i18nKey}.description`)}
						</p>
					</div>
				</div>

				{/* Meta */}
				<div
					className="flex items-center gap-3 mt-3 text-[10px]"
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

				{/* Tags */}
				<div className="flex flex-wrap gap-1.5 mt-2.5">
					{post.tags.map((tag) => (
						<span
							key={tag}
							className="text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
							style={{
								background: `${post.color}12`,
								color: post.color,
								border: `1px solid ${post.color}28`,
							}}
						>
							<Tag size={8} />
							{tag}
						</span>
					))}
				</div>
			</div>

			{/* Content */}
			<div ref={scrollRef} className="flex-1 overflow-auto min-h-0 px-5 py-4">
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<div
							className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
							style={{
								borderColor: `${post.color}40`,
								borderTopColor: post.color,
							}}
						/>
					</div>
				) : (
					<ReadmeRenderer
						content={content ?? ""}
						accentColor={post.color}
						scrollRef={scrollRef}
					/>
				)}
			</div>
		</div>
	);
}
