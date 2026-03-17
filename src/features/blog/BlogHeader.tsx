"use client";

import { BookOpen, Rss } from "lucide-react";
import { useTranslations } from "next-intl";
import { BLOG_POSTS } from "./blog.data";

interface BlogHeaderProps {
	totalTags: string[];
	activeTags: string[];
	onTagToggle: (tag: string) => void;
}

export function BlogHeader({
	totalTags,
	activeTags,
	onTagToggle,
}: BlogHeaderProps) {
	const t = useTranslations("BlogWindow");
	const published = BLOG_POSTS.filter((p) => p.published).length;

	return (
		<div
			className="shrink-0 border-b relative overflow-hidden"
			style={{ borderColor: "var(--border)" }}
		>
			{/* Top accent bar orange → purple */}
			<div
				className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
				style={{
					background:
						"linear-gradient(90deg, #e95420 0%, #77216f 60%, transparent 100%)",
				}}
			/>

			{/* Diagonal hatching lines — kanan atas, pakai var(--border) → ikut tema */}
			<svg
				className="absolute top-0 right-0 pointer-events-none"
				width="140"
				height="130"
				aria-hidden="true"
			>
				{Array.from({ length: 10 }, (_, i) => i * 15).map((offset) => (
					<line
						key={offset}
						x1={140 - offset}
						y1={0}
						x2={140}
						y2={offset}
						stroke="var(--border)"
						strokeWidth="1"
					/>
				))}
			</svg>

			{/* Dot grid — pojok kiri bawah */}
			<div
				className="absolute bottom-0 left-0 pointer-events-none"
				style={{
					width: "120px",
					height: "80px",
					backgroundImage:
						"radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)",
					backgroundSize: "14px 14px",
					maskImage:
						"linear-gradient(135deg, rgba(0,0,0,0.6) 0%, transparent 70%)",
					WebkitMaskImage:
						"linear-gradient(135deg, rgba(0,0,0,0.6) 0%, transparent 70%)",
				}}
			/>

			{/* Bottom border accent */}
			<div
				className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
				style={{
					background:
						"linear-gradient(90deg, rgba(233,84,32,0.35), transparent 60%)",
				}}
			/>

			{/* ── Content ───────────────────────────────────────── */}
			<div className="relative px-5 pt-5 pb-4" style={{ zIndex: 1 }}>
				{/* Title row */}
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-center gap-3">
						{/* Icon with subtle glow */}
						<div className="relative">
							<div
								className="absolute inset-0 rounded-xl blur-sm pointer-events-none"
								style={{ background: "rgba(233,84,32,0.3)" }}
							/>
							<div className="relative w-9 h-9 rounded-xl bg-ubuntu-orange flex items-center justify-center shadow-md">
								<BookOpen size={15} className="text-white" />
							</div>
						</div>

						<div>
							<h1
								className="text-base font-bold leading-tight"
								style={{ color: "var(--text-primary)" }}
							>
								{t("title")}
							</h1>
							<p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
								{t("subtitle", { count: published })}
							</p>
						</div>
					</div>
				</div>

				<p
					className="text-xs leading-relaxed mb-4"
					style={{ color: "var(--text-secondary)" }}
				>
					{t("headerDesc")}
				</p>

				<div className="flex items-center gap-2 mb-2.5">
					<span
						className="text-[9px] font-semibold uppercase tracking-widest shrink-0"
						style={{ color: "var(--text-muted)" }}
					>
						{t("filterHint")}
					</span>
					<div
						className="flex-1 h-px"
						style={{
							background: "linear-gradient(90deg, var(--border), transparent)",
						}}
					/>
				</div>

				{/* Tag filter pills */}
				{totalTags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{totalTags.map((tag) => {
							const active = activeTags.includes(tag);
							return (
								<button
									key={tag}
									type="button"
									onClick={() => onTagToggle(tag)}
									className="text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-all duration-150"
									style={
										active
											? {
													background:
														"linear-gradient(135deg, #e95420, #c0392b)",
													color: "white",
													border: "1px solid #e95420",
													boxShadow: "0 2px 8px rgba(233,84,32,0.3)",
												}
											: {
													background: "var(--surface-secondary)",
													color: "var(--text-muted)",
													border: "1px solid var(--border)",
												}
									}
								>
									{tag}
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
