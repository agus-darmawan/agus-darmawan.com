"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useGitHubStars } from "./hooks/useGitHubStars";
import { ProjectCard } from "./ProjectCard";
import {
	PROJECTS_META,
	type ProjectCategory,
	type ProjectMeta,
} from "./projects.data";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ProjectCategory | "all", string> = {
	all: "All",
	web: "Web",
	robotics: "Robotics",
	research: "Research",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProjectsWindow() {
	const t = useTranslations("ProjectsWindow");
	const tProjects = useTranslations("Projects");
	const [filter, setFilter] = useState<ProjectCategory | "all">("all");

	// Live star counts from GitHub API — falls back to hardcoded if unavailable
	const { getStars } = useGitHubStars();

	const filtered = useMemo(
		() =>
			filter === "all"
				? PROJECTS_META
				: PROJECTS_META.filter((p) => p.category === filter),
		[filter],
	);

	// Total stars — live from GitHub
	const totalStars = useMemo(
		() =>
			PROJECTS_META.reduce((s, p) => s + getStars(p.githubRepo, p.stars), 0),
		[getStars],
	);

	const featuredCount = useMemo(
		() => PROJECTS_META.filter((p) => p.featured).length,
		[],
	);

	const categories = Object.entries(CATEGORY_LABELS) as [
		ProjectCategory | "all",
		string,
	][];

	const handleCardClick = (project: ProjectMeta) => {
		window.dispatchEvent(
			new CustomEvent("openReadme", {
				detail: {
					kind: "readme",
					project,
					name: tProjects(`${project.i18nKey}.name`),
					desc: tProjects(`${project.i18nKey}.desc`),
					readmeFile: tProjects(`${project.i18nKey}.readmeFile`),
				},
			}),
		);
	};

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

				{/* Category filters */}
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
								stars={getStars(project.githubRepo, project.stars)}
								onClick={handleCardClick}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
