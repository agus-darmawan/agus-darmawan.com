"use client";

import { ArrowLeft, ExternalLink, Github, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PROJECTS_META } from "@/components/windows/content/projects/projectsData";
import { ReadmeRenderer } from "@/components/windows/content/projects/readme/ReadmeRenderer";

export default function ProjectPage() {
	const params = useParams();
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("ProjectsWindow");
	const tProjects = useTranslations("Projects");

	const projectId = params?.id as string;
	const meta = PROJECTS_META.find((p) => p.id === projectId);

	const [readmeContent, setReadmeContent] = useState<string>("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!meta) return;
		const readmeFile = tProjects(`${meta.i18nKey}.readmeFile`);
		fetch(`/readme/${locale}/${readmeFile}.mdx`)
			.then((r) => (r.ok ? r.text() : Promise.reject()))
			.then(setReadmeContent)
			.catch(() => setReadmeContent("# README\n\nContent not available."))
			.finally(() => setLoading(false));
	}, [meta, locale, tProjects]);

	if (!meta) {
		return (
			<div className="h-screen flex items-center justify-center bg-(--window-bg)">
				<p className="text-(--text-muted)">Project not found.</p>
			</div>
		);
	}

	const name = tProjects(`${meta.i18nKey}.name`);
	const desc = tProjects(`${meta.i18nKey}.desc`);

	const CATEGORY_COLOR: Record<string, string> = {
		web: "#e95420",
		robotics: "#10b981",
		research: "#8b5cf6",
	};

	return (
		<div
			className="min-h-screen"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* Top navigation bar */}
			<header
				className="sticky top-0 z-50 border-b px-4 sm:px-8 h-12 flex items-center gap-4"
				style={{
					background: "var(--topbar-bg)",
					borderColor: "var(--topbar-border)",
					backdropFilter: "blur(12px)",
				}}
			>
				<button
					type="button"
					onClick={() => router.back()}
					className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
					style={{ color: "var(--topbar-text)" }}
				>
					<ArrowLeft size={16} />
					<span className="hidden sm:inline">{t("backToProjects")}</span>
				</button>

				<div
					className="w-px h-4 rounded-full mx-1"
					style={{ background: "rgba(255,255,255,0.15)" }}
				/>

				<div className="flex items-center gap-2 flex-1 min-w-0">
					<span className="text-lg leading-none">{meta.emoji}</span>
					<span
						className="text-sm font-semibold truncate"
						style={{ color: "var(--topbar-text)" }}
					>
						{name}
					</span>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<a
						href={meta.github}
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
						style={{
							color: "var(--topbar-text)",
							borderColor: "rgba(255,255,255,0.2)",
						}}
					>
						<Github size={13} />
						<span className="hidden sm:inline">{t("viewCode")}</span>
					</a>
					{meta.demo && (
						<a
							href={meta.demo}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-white"
							style={{ background: meta.color }}
						>
							<ExternalLink size={13} />
							<span className="hidden sm:inline">{t("viewDemo")}</span>
						</a>
					)}
				</div>
			</header>

			{/* Hero section */}
			<div
				className="px-4 sm:px-8 py-10 border-b"
				style={{
					borderColor: "var(--border)",
					background: `linear-gradient(135deg, ${meta.color}10 0%, transparent 60%)`,
				}}
			>
				<div className="max-w-4xl mx-auto">
					<div className="flex items-start gap-5">
						<div
							className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
							style={{
								background: `${meta.color}20`,
								border: `1px solid ${meta.color}30`,
							}}
						>
							{meta.emoji}
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex flex-wrap items-center gap-2 mb-1">
								<h1
									className="text-2xl font-bold"
									style={{ color: "var(--text-primary)" }}
								>
									{name}
								</h1>
								{meta.featured && (
									<span
										className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
										style={{
											background: `${meta.color}18`,
											color: meta.color,
											border: `1px solid ${meta.color}30`,
										}}
									>
										Featured
									</span>
								)}
							</div>

							<p
								className="text-sm mb-4"
								style={{ color: "var(--text-secondary)" }}
							>
								{desc}
							</p>

							{/* Stats row */}
							<div className="flex flex-wrap items-center gap-4 mb-4">
								<span
									className="flex items-center gap-1.5 text-sm"
									style={{ color: "var(--text-muted)" }}
								>
									<Star size={14} />
									{meta.stars} {t("stars")}
								</span>
								<span
									className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
									style={{
										background: `${CATEGORY_COLOR[meta.category] ?? meta.color}18`,
										color: CATEGORY_COLOR[meta.category] ?? meta.color,
										border: `1px solid ${CATEGORY_COLOR[meta.category] ?? meta.color}30`,
									}}
								>
									{meta.category}
								</span>
							</div>

							{/* Tech badges */}
							<div className="flex flex-wrap gap-1.5">
								{meta.tech.map((tech) => (
									<span
										key={tech}
										className="text-xs px-2.5 py-1 rounded-full font-medium"
										style={{
											background: `${meta.color}12`,
											color: meta.color,
											border: `1px solid ${meta.color}28`,
										}}
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* README content */}
			<div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
				{loading ? (
					<div className="flex items-center justify-center py-24">
						<div
							className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
							style={{
								borderColor: "var(--border)",
								borderTopColor: meta.color,
							}}
						/>
					</div>
				) : (
					<ReadmeRenderer content={readmeContent} accentColor={meta.color} />
				)}
			</div>
		</div>
	);
}
