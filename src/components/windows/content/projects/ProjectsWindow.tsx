"use client";

import {
	ArrowUpRight,
	ExternalLink,
	GitFork,
	Github,
	Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
	PROJECTS_META,
	type ProjectCategory,
	type ProjectMeta,
} from "./projectsData";

const CATEGORY_LABELS: Record<ProjectCategory | "all", string> = {
	all: "All",
	web: "Web",
	robotics: "Robotics",
	research: "Research",
};

interface ProjectsWindowProps {
	/** Called when user wants to open README as a new window */
	onOpenReadme?: (
		project: ProjectMeta,
		name: string,
		desc: string,
		readmeFile: string,
	) => void;
}

export default function ProjectsWindow({ onOpenReadme }: ProjectsWindowProps) {
	const t = useTranslations("ProjectsWindow");
	const tProjects = useTranslations("Projects");
	const [filter, setFilter] = useState<ProjectCategory | "all">("all");

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
			className="h-full flex flex-col"
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
								viewCodeLabel={t("viewCode")}
								viewDemoLabel={t("viewDemo")}
								onReadMore={
									onOpenReadme
										? () =>
												onOpenReadme(
													project,
													tProjects(`${project.i18nKey}.name`),
													tProjects(`${project.i18nKey}.desc`),
													tProjects(`${project.i18nKey}.readmeFile`),
												)
										: undefined
								}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// ── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({
	project,
	name,
	desc,
	readMoreLabel,
	viewCodeLabel,
	viewDemoLabel,
	onReadMore,
}: {
	project: ProjectMeta;
	name: string;
	desc: string;
	readMoreLabel: string;
	viewCodeLabel: string;
	viewDemoLabel: string;
	onReadMore?: () => void;
}) {
	return (
		<div
			className="group w-full rounded-2xl overflow-hidden transition-all duration-200 relative"
			style={{
				background: "var(--surface-secondary)",
				border: "1px solid var(--border)",
			}}
			onMouseEnter={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = `${project.color}60`;
				el.style.boxShadow = `0 4px 20px ${project.color}15`;
			}}
			onMouseLeave={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = "var(--border)";
				el.style.boxShadow = "none";
			}}
		>
			{/* Top color bar */}
			<div
				className="h-0.5 w-full"
				style={{
					background: project.featured
						? `linear-gradient(90deg, ${project.color}, ${project.color}40)`
						: `${project.color}40`,
				}}
			/>

			{/* Hover glow */}
			<div
				className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
				style={{
					background: `radial-gradient(ellipse at top left, ${project.color}06 0%, transparent 60%)`,
				}}
			/>

			<div className="relative p-4">
				{/* Top row */}
				<div className="flex items-start gap-3 mb-3">
					<div
						className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
						style={{
							background: `${project.color}18`,
							border: `1px solid ${project.color}28`,
						}}
					>
						{project.emoji}
					</div>
					<div className="flex-1 min-w-0">
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

				{/* Description */}
				<p
					className="text-xs leading-relaxed mb-3 line-clamp-2"
					style={{ color: "var(--text-secondary)" }}
				>
					{desc}
				</p>

				{/* Tech tags */}
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

				{/* Footer row */}
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

					{/* Action buttons */}
					<div className="flex items-center gap-1.5">
						<a
							href={project.github}
							target="_blank"
							rel="noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border font-medium transition-colors"
							style={{
								color: "var(--text-muted)",
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
									"var(--text-muted)";
							}}
						>
							<Github size={10} />
							{viewCodeLabel}
						</a>

						{project.demo && (
							<a
								href={project.demo}
								target="_blank"
								rel="noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium text-white transition-opacity hover:opacity-80"
								style={{ background: project.color }}
							>
								<ExternalLink size={10} />
								{viewDemoLabel}
							</a>
						)}

						{onReadMore && (
							<button
								type="button"
								onClick={onReadMore}
								className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border font-medium transition-all duration-150"
								style={{
									color: project.color,
									borderColor: `${project.color}40`,
									background: `${project.color}08`,
								}}
								onMouseEnter={(e) => {
									(e.currentTarget as HTMLElement).style.background =
										`${project.color}18`;
								}}
								onMouseLeave={(e) => {
									(e.currentTarget as HTMLElement).style.background =
										`${project.color}08`;
								}}
							>
								<ArrowUpRight size={10} />
								{readMoreLabel}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
