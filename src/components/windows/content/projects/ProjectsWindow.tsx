"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import { PROJECTS, type Project, type ProjectCategory } from "./projectsData";

export default function ProjectsWindow() {
	const t = useTranslations("ProjectsWindow");
	const [filter, setFilter] = useState<ProjectCategory | "all">("all");
	const [selected, setSelected] = useState<Project | null>(null);

	const categories: { key: ProjectCategory | "all"; label: string }[] = [
		{ key: "all", label: t("allProjects") },
		{ key: "web", label: "Web Apps" },
		{ key: "cli", label: "CLI" },
		{ key: "library", label: "Libraries" },
	];

	const filtered =
		filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

	return (
		<div
			className="h-full flex flex-col relative"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* Header */}
			<div
				className="px-5 pt-5 pb-3 border-b shrink-0"
				style={{ borderColor: "var(--border)" }}
			>
				<div className="flex items-center justify-between mb-3">
					<h1 className="text-lg font-bold">{t("title")}</h1>
					<span
						className="text-xs px-2 py-0.5 rounded-full font-medium"
						style={{
							background: "#e9542018",
							color: "#e95420",
							border: "1px solid #e9542030",
						}}
					>
						{PROJECTS.length} projects
					</span>
				</div>

				<div className="flex gap-1.5">
					{categories.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => setFilter(key)}
							className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
							style={
								filter === key
									? { background: "#e95420", color: "white" }
									: {
											background: "var(--surface-secondary)",
											color: "var(--text-secondary)",
											border: "1px solid var(--border)",
										}
							}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* List */}
			<div className="flex-1 overflow-auto px-5 py-4">
				{filter === "all" && (
					<p
						className="text-xs font-medium uppercase tracking-wider mb-3"
						style={{ color: "var(--text-muted)" }}
					>
						⭐ {t("featured")}
					</p>
				)}
				<div className="grid grid-cols-1 gap-3">
					{filtered.map((project) => (
						<ProjectCard
							key={project.id}
							project={project}
							onClick={setSelected}
							t={t}
						/>
					))}
				</div>
			</div>

			{/* Detail popup */}
			{selected && (
				<ProjectDetail
					project={selected}
					onClose={() => setSelected(null)}
					t={t}
				/>
			)}
		</div>
	);
}
