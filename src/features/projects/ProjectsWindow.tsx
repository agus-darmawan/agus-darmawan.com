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

const CATEGORY_LABELS: Record<ProjectCategory | "all", string> = {
	all: "All",
	web: "Web",
	robotics: "Robotics",
	research: "Research",
};

const CATEGORY_COLORS: Record<ProjectCategory | "all", string> = {
	all: "#e95420",
	web: "#3b82f6",
	robotics: "#10b981",
	research: "#8b5cf6",
};

export default function ProjectsWindow() {
	const t = useTranslations("ProjectsWindow");
	const tProjects = useTranslations("Projects");
	const [filter, setFilter] = useState<ProjectCategory | "all">("all");

	const { getStars, getForks } = useGitHubStars();

	const filtered = useMemo(
		() =>
			filter === "all"
				? PROJECTS_META
				: PROJECTS_META.filter((p) => p.category === filter),
		[filter],
	);

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

	const activeColor = CATEGORY_COLORS[filter];

	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* ── Header ─────────────────────────────────────────── */}
			<div
				className="shrink-0 border-b relative overflow-hidden"
				style={{ borderColor: "var(--border)" }}
			>
				{/* Top accent bar — warna ngikut filter aktif */}
				<div
					className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none transition-all duration-300"
					style={{
						background: `linear-gradient(90deg, ${activeColor} 0%, ${activeColor}60 50%, transparent 100%)`,
					}}
				/>

				{/* Concentric arc decoration — kanan, geometric bukan glow */}
				<svg
					className="absolute right-0 top-0 bottom-0 pointer-events-none"
					width="100"
					height="100%"
					aria-hidden="true"
					style={{ opacity: 0.5 }}
					preserveAspectRatio="none"
				>
					{[20, 40, 60, 80].map((r) => (
						<circle
							key={r}
							cx="100"
							cy="50%"
							r={r}
							fill="none"
							stroke="var(--border)"
							strokeWidth="1"
						/>
					))}
				</svg>

				{/* Dot grid — pojok kiri bawah */}
				<div
					className="absolute bottom-0 left-0 pointer-events-none"
					style={{
						width: "100px",
						height: "60px",
						backgroundImage:
							"radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)",
						backgroundSize: "12px 12px",
						maskImage:
							"linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 65%)",
						WebkitMaskImage:
							"linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 65%)",
					}}
				/>

				{/* Bottom accent — warna ngikut filter */}
				<div
					className="absolute bottom-0 left-0 right-0 h-px pointer-events-none transition-all duration-300"
					style={{
						background: `linear-gradient(90deg, ${activeColor}40, transparent 60%)`,
					}}
				/>

				{/* Content */}
				<div className="relative px-5 pt-5 pb-4" style={{ zIndex: 1 }}>
					{/* Top row: title + stats */}
					<div className="flex items-start justify-between gap-3 mb-3">
						<div className="flex items-center gap-3">
							{/* Icon — glow warna aktif */}
							<div className="relative">
								<div
									className="absolute inset-0 rounded-xl blur-sm pointer-events-none transition-colors duration-300"
									style={{ background: `${activeColor}40` }}
								/>
								<div
									className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors duration-300"
									style={{ background: activeColor }}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
									</svg>
								</div>
							</div>

							<div>
								<h1
									className="text-base font-bold leading-tight"
									style={{ color: "var(--text-primary)" }}
								>
									{t("title")}
								</h1>
								<p
									className="text-[11px]"
									style={{ color: "var(--text-muted)" }}
								>
									{PROJECTS_META.length} projects · {featuredCount} featured
								</p>
							</div>
						</div>

						{/* Stats */}
						<div className="flex items-center gap-2 shrink-0">
							<div
								className="text-center px-2.5 py-1 rounded-lg border"
								style={{
									background: "rgba(233,84,32,0.08)",
									borderColor: "rgba(233,84,32,0.2)",
								}}
							>
								<p
									className="text-sm font-bold tabular-nums leading-none"
									style={{ color: "var(--text-primary)" }}
								>
									{totalStars}
								</p>
								<p
									className="text-[9px] uppercase tracking-wide mt-0.5"
									style={{ color: "var(--text-muted)" }}
								>
									{t("stars")}
								</p>
							</div>

							<div
								className="w-px h-6 rounded-full"
								style={{ background: "var(--border)" }}
							/>

							<div
								className="text-center px-2.5 py-1 rounded-lg border"
								style={{
									background: "rgba(233,84,32,0.08)",
									borderColor: "rgba(233,84,32,0.2)",
								}}
							>
								<p
									className="text-sm font-bold tabular-nums leading-none"
									style={{ color: "var(--text-primary)" }}
								>
									{PROJECTS_META.length}
								</p>
								<p
									className="text-[9px] uppercase tracking-wide mt-0.5"
									style={{ color: "var(--text-muted)" }}
								>
									{t("repos")}
								</p>
							</div>
						</div>
					</div>

					{/* Description */}
					<p
						className="text-xs leading-relaxed mb-4"
						style={{ color: "var(--text-secondary)" }}
					>
						{t("headerDesc")}
					</p>

					{/* Category filter */}
					<div className="flex items-center gap-2 mb-0.5">
						<span
							className="text-[9px] font-semibold uppercase tracking-widest shrink-0"
							style={{ color: "var(--text-muted)" }}
						>
							Category
						</span>
						<div
							className="flex-1 h-px"
							style={{
								background:
									"linear-gradient(90deg, var(--border), transparent)",
							}}
						/>
					</div>

					<div className="flex gap-1.5 flex-wrap mt-2">
						{categories.map(([key, label]) => {
							const count =
								key === "all"
									? PROJECTS_META.length
									: PROJECTS_META.filter((p) => p.category === key).length;
							const active = filter === key;
							const color = CATEGORY_COLORS[key];

							return (
								<button
									key={key}
									type="button"
									onClick={() => setFilter(key)}
									className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200"
									style={
										active
											? {
													background: `linear-gradient(135deg, ${color}, ${color}cc)`,
													color: "white",
													boxShadow: `0 2px 8px ${color}35`,
												}
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
								forks={getForks(project.githubRepo)}
								onClick={handleCardClick}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
