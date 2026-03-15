"use client";

import {
	ArrowUpRight,
	ExternalLink,
	GitFork,
	Github,
	Loader2,
	Star,
	X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	PROJECTS_META,
	type ProjectCategory,
	type ProjectMeta,
} from "./projectsData";
import { ReadmeRenderer } from "./readme/ReadmeRenderer";

// ── Category labels ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ProjectCategory | "all", string> = {
	all: "All",
	web: "Web",
	robotics: "Robotics",
	research: "Research",
};

// ── Main window ──────────────────────────────────────────────────────────────

export default function ProjectsWindow() {
	const t = useTranslations("ProjectsWindow");
	const tProjects = useTranslations("Projects");
	const locale = useLocale();
	const [filter, setFilter] = useState<ProjectCategory | "all">("all");
	const [selected, setSelected] = useState<ProjectMeta | null>(null);

	const filtered = useMemo(
		() =>
			filter === "all"
				? PROJECTS_META
				: PROJECTS_META.filter((p) => p.category === filter),
		[filter],
	);

	const totalStars = PROJECTS_META.reduce((s, p) => s + p.stars, 0);
	const featuredCount = PROJECTS_META.filter((p) => p.featured).length;
	const categories = Object.entries(CATEGORY_LABELS) as [
		ProjectCategory | "all",
		string,
	][];

	return (
		<div
			className="h-full flex flex-col relative"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* ── Header ─────────────────────────────────────────── */}
			<div
				className="px-5 pt-5 pb-3 border-b shrink-0"
				style={{ borderColor: "var(--border)" }}
			>
				<div className="flex items-start justify-between mb-3">
					<div>
						<h1 className="text-base font-bold leading-tight">{t("title")}</h1>
						<p
							className="text-xs mt-0.5"
							style={{ color: "var(--text-muted)" }}
						>
							{PROJECTS_META.length} projects · {featuredCount} featured
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="text-center">
							<p
								className="text-sm font-bold tabular-nums"
								style={{ color: "var(--text-primary)" }}
							>
								{totalStars}
							</p>
							<p
								className="text-[9px] uppercase tracking-wide"
								style={{ color: "var(--text-muted)" }}
							>
								{t("stars")}
							</p>
						</div>
						<div
							className="w-px h-6 rounded-full"
							style={{ background: "var(--border)" }}
						/>
						<div className="text-center">
							<p
								className="text-sm font-bold tabular-nums"
								style={{ color: "var(--text-primary)" }}
							>
								{PROJECTS_META.length}
							</p>
							<p
								className="text-[9px] uppercase tracking-wide"
								style={{ color: "var(--text-muted)" }}
							>
								{t("repos")}
							</p>
						</div>
					</div>
				</div>

				{/* Filter pills */}
				<div className="flex gap-1.5 flex-wrap">
					{categories.map(([key, label]) => {
						const count =
							key === "all"
								? PROJECTS_META.length
								: PROJECTS_META.filter((p) => p.category === key).length;
						const active = filter === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setFilter(key)}
								className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150"
								style={
									active
										? { background: "#e95420", color: "white" }
										: {
												background: "var(--surface-secondary)",
												color: "var(--text-secondary)",
												border: "1px solid var(--border)",
											}
								}
							>
								{label}
								<span
									className="text-[9px] px-1 py-0.5 rounded-full font-semibold tabular-nums"
									style={{
										background: active
											? "rgba(255,255,255,0.25)"
											: "var(--border)",
										color: active ? "white" : "var(--text-muted)",
									}}
								>
									{count}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* ── Grid ───────────────────────────────────────────── */}
			<div className="flex-1 overflow-auto px-5 py-4">
				{filter === "all" && (
					<div className="flex items-center gap-2 mb-3">
						<span
							className="text-[10px] font-semibold uppercase tracking-widest"
							style={{ color: "var(--text-muted)" }}
						>
							⭐ {t("featured")}
						</span>
						<div
							className="flex-1 h-px"
							style={{ background: "var(--border)" }}
						/>
					</div>
				)}

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<p className="text-2xl mb-2">🗂️</p>
						<p className="text-sm" style={{ color: "var(--text-muted)" }}>
							No projects in this category
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-3">
						{filtered.map((project) => (
							<ProjectCard
								key={project.id}
								project={project}
								name={tProjects(`${project.i18nKey}.name`)}
								desc={tProjects(`${project.i18nKey}.desc`)}
								readMoreLabel={t("readMore")}
								onClick={setSelected}
							/>
						))}
					</div>
				)}
			</div>

			{/* ── Detail popup ───────────────────────────────────── */}
			{selected && (
				<ProjectDetail
					project={selected}
					name={tProjects(`${selected.i18nKey}.name`)}
					desc={tProjects(`${selected.i18nKey}.desc`)}
					readmeFile={tProjects(`${selected.i18nKey}.readmeFile`)}
					locale={locale}
					onClose={() => setSelected(null)}
					viewCodeLabel={t("viewCode")}
					viewDemoLabel={t("viewDemo")}
				/>
			)}
		</div>
	);
}

// ── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({
	project,
	name,
	desc,
	readMoreLabel,
	onClick,
}: {
	project: ProjectMeta;
	name: string;
	desc: string;
	readMoreLabel: string;
	onClick: (p: ProjectMeta) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => onClick(project)}
			className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-200 relative"
			style={{
				background: "var(--surface-secondary)",
				border: "1px solid var(--border)",
			}}
			onMouseEnter={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = `${project.color}60`;
				el.style.transform = "translateY(-2px)";
				el.style.boxShadow = `0 8px 32px ${project.color}20`;
			}}
			onMouseLeave={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = "var(--border)";
				el.style.transform = "none";
				el.style.boxShadow = "none";
			}}
		>
			<div
				className="h-0.5 w-full"
				style={{
					background: project.featured
						? `linear-gradient(90deg, ${project.color}, ${project.color}40)`
						: `${project.color}40`,
				}}
			/>
			<div
				className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
				style={{
					background: `radial-gradient(ellipse at top left, ${project.color}08 0%, transparent 60%)`,
				}}
			/>

			<div className="relative p-4">
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-start gap-3">
						<div
							className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
							style={{
								background: `${project.color}18`,
								border: `1px solid ${project.color}28`,
							}}
						>
							{project.emoji}
						</div>
						<div className="min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h2
									className="font-semibold text-sm leading-tight"
									style={{ color: "var(--text-primary)" }}
								>
									{name}
								</h2>
								{project.featured && (
									<span
										className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide"
										style={{
											background: `${project.color}18`,
											color: project.color,
											border: `1px solid ${project.color}30`,
										}}
									>
										Featured
									</span>
								)}
							</div>
							<span
								className="text-[10px] mt-0.5 inline-block capitalize"
								style={{ color: "var(--text-muted)" }}
							>
								{project.category}
							</span>
						</div>
					</div>
					<div
						className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						style={{ background: `${project.color}18`, color: project.color }}
					>
						<ArrowUpRight size={14} />
					</div>
				</div>

				<p
					className="text-xs leading-relaxed mb-3 line-clamp-2"
					style={{ color: "var(--text-secondary)" }}
				>
					{desc}
				</p>

				<div className="flex flex-wrap gap-1.5 mb-3">
					{project.tech.slice(0, 4).map((tech) => (
						<span
							key={tech}
							className="text-[10px] px-2 py-0.5 rounded-md font-medium"
							style={{
								background: "var(--window-bg)",
								color: "var(--text-muted)",
								border: "1px solid var(--border)",
							}}
						>
							{tech}
						</span>
					))}
					{project.tech.length > 4 && (
						<span
							className="text-[10px] px-2 py-0.5 rounded-md"
							style={{ color: "var(--text-muted)" }}
						>
							+{project.tech.length - 4} more
						</span>
					)}
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span
							className="flex items-center gap-1 text-[11px]"
							style={{ color: "var(--text-muted)" }}
						>
							<Star size={11} />
							{project.stars}
						</span>
						<span
							className="flex items-center gap-1 text-[11px]"
							style={{ color: "var(--text-muted)" }}
						>
							<GitFork size={11} />
							{Math.floor(project.stars * 0.4)}
						</span>
					</div>
					<span
						className="text-[10px] font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
						style={{ color: project.color }}
					>
						{readMoreLabel} →
					</span>
				</div>
			</div>
		</button>
	);
}

// ── Project detail popup ─────────────────────────────────────────────────────

function ProjectDetail({
	project,
	name,
	desc,
	readmeFile,
	locale,
	onClose,
	viewCodeLabel,
	viewDemoLabel,
}: {
	project: ProjectMeta;
	name: string;
	desc: string;
	readmeFile: string;
	locale: string;
	onClose: () => void;
	viewCodeLabel: string;
	viewDemoLabel: string;
}) {
	// The scrollable container ref — passed into ReadmeRenderer so TOC
	// can attach its scroll listener to the correct element.
	const scrollRef = useRef<HTMLDivElement>(null);
	const [readmeContent, setReadmeContent] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch README on mount
	useEffect(() => {
		fetch(`/readme/${locale}/${readmeFile}.mdx`)
			.then((r) => (r.ok ? r.text() : Promise.reject(new Error("not found"))))
			.then((text) => setReadmeContent(text))
			.catch(() => setReadmeContent(`# ${name}\n\n${desc}`))
			.finally(() => setLoading(false));
	}, [locale, readmeFile, name, desc]);

	return (
		<div
			className="absolute inset-0 z-50 flex animate-fade-in"
			style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className="m-auto w-full max-w-2xl max-h-[90%] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
				style={{
					background: "var(--window-bg)",
					border: `1px solid ${project.color}40`,
				}}
			>
				{/* Header */}
				<div
					className="flex items-start gap-4 px-5 py-4 border-b shrink-0"
					style={{
						borderColor: "var(--border)",
						background: `linear-gradient(135deg, ${project.color}12 0%, transparent 60%)`,
					}}
				>
					<div
						className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
						style={{ background: `${project.color}20` }}
					>
						{project.emoji}
					</div>
					<div className="flex-1 min-w-0">
						<h2
							className="font-bold text-base"
							style={{ color: "var(--text-primary)" }}
						>
							{name}
						</h2>
						<p
							className="text-xs mt-0.5"
							style={{ color: "var(--text-muted)" }}
						>
							{desc}
						</p>
						<div className="flex items-center gap-3 mt-2 flex-wrap">
							<span
								className="flex items-center gap-1 text-xs"
								style={{ color: "var(--text-muted)" }}
							>
								<Star size={11} />
								{project.stars} stars
							</span>
							<span
								className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
								style={{
									background: `${project.color}18`,
									color: project.color,
									border: `1px solid ${project.color}30`,
								}}
							>
								{project.category}
							</span>
						</div>
					</div>
					<button
						type="button"
						title="Close"
						aria-label="Close project detail"
						onClick={onClose}
						className="p-1.5 rounded-lg transition-colors shrink-0"
						style={{ color: "var(--text-muted)" }}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.background =
								"var(--surface-secondary)";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.background = "transparent";
						}}
					>
						<X size={16} />
					</button>
				</div>

				{/* Tech badges */}
				<div
					className="px-5 py-3 flex flex-wrap gap-1.5 border-b shrink-0"
					style={{ borderColor: "var(--border)" }}
				>
					{project.tech.map((tech) => (
						<span
							key={tech}
							className="text-xs px-2 py-0.5 rounded-full font-medium"
							style={{
								background: `${project.color}12`,
								color: project.color,
								border: `1px solid ${project.color}28`,
							}}
						>
							{tech}
						</span>
					))}
				</div>

				{/* README — this div is the scroll container, ref passed to ReadmeRenderer */}
				<div ref={scrollRef} className="flex-1 overflow-auto min-h-0 px-5 py-4">
					{loading ? (
						<div className="flex items-center justify-center py-16">
							<Loader2
								size={22}
								className="animate-spin"
								style={{ color: project.color }}
							/>
						</div>
					) : (
						<ReadmeRenderer
							content={readmeContent ?? ""}
							accentColor={project.color}
							scrollRef={scrollRef}
						/>
					)}
				</div>

				{/* Footer */}
				<div
					className="px-5 py-3 border-t flex gap-2 shrink-0"
					style={{ borderColor: "var(--border)" }}
				>
					<a
						href={project.github}
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium transition-colors"
						style={{
							color: "var(--text-secondary)",
							borderColor: "var(--border)",
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								project.color;
							(e.currentTarget as HTMLElement).style.color = project.color;
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								"var(--border)";
							(e.currentTarget as HTMLElement).style.color =
								"var(--text-secondary)";
						}}
					>
						<Github size={13} />
						{viewCodeLabel}
					</a>
					{project.demo && (
						<a
							href={project.demo}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium text-white"
							style={{ background: project.color }}
						>
							<ExternalLink size={13} />
							{viewDemoLabel}
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
