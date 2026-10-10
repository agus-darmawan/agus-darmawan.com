"use client";

import { Folder } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ContentCard } from "@/components/content/ContentCard";
import { useContent } from "@/components/content/ContentProvider";
import { WindowHero } from "@/components/window/WindowHero";
import type { ContentMeta, ProjectCategory } from "@/lib/content/types";
import { useWindowStore } from "@/store/useWindowStore";
import { projectWindowId } from "@/types/app";

type Filter = ProjectCategory | "all";

const FILTERS: Filter[] = ["all", "web", "robotics", "research"];

const FILTER_COLORS: Record<Filter, string> = {
	all: "#e95420",
	web: "#3b82f6",
	robotics: "#10b981",
	research: "#8b5cf6",
};

export default function ProjectsWindow() {
	const t = useTranslations("ProjectsWindow");
	const tc = useTranslations("Content");
	const { projects } = useContent();
	const openWindow = useWindowStore((s) => s.openWindow);
	const [filter, setFilter] = useState<Filter>("all");

	const stats = useMemo(() => {
		const counts = { all: projects.length, web: 0, robotics: 0, research: 0 };
		for (const p of projects) counts[p.category]++;
		return {
			counts,
			featured: projects.filter((p) => p.featured).length,
			// Only real numbers from GitHub — no more invented fallbacks.
			stars: projects.reduce((sum, p) => sum + (p.stars ?? 0), 0),
		};
	}, [projects]);

	const visible = useMemo(
		() =>
			filter === "all"
				? projects
				: projects.filter((p) => p.category === filter),
		[projects, filter],
	);

	const openProject = (item: ContentMeta) =>
		openWindow(projectWindowId(item.slug), {
			kind: "project",
			slug: item.slug,
			title: item.title,
			emoji: item.emoji,
		});

	const accent = FILTER_COLORS[filter];

	return (
		<div className="h-full flex flex-col bg-(--window-bg) text-(--text-primary)">
			<WindowHero
				accent={accent}
				icon={<Folder size={16} className="text-white" />}
				title={t("title")}
				subtitle={tc("projectsSummary", {
					count: stats.counts.all,
					featured: stats.featured,
				})}
				description={t("headerDesc")}
				stats={[
					...(stats.stars > 0
						? [{ value: stats.stars, label: t("stars") }]
						: []),
					{ value: stats.counts.all, label: t("repos") },
				]}
			>
				<div className="flex items-center gap-2 mb-2">
					<span className="text-[9px] font-semibold uppercase tracking-widest shrink-0 text-(--text-muted)">
						{tc("categoryLabel")}
					</span>
					<div className="flex-1 h-px bg-linear-to-r from-(--border) to-transparent" />
				</div>

				<div className="flex gap-1.5 flex-wrap">
					{FILTERS.filter((f) => f === "all" || stats.counts[f] > 0).map(
						(key) => {
							const active = filter === key;
							const color = FILTER_COLORS[key];
							return (
								<button
									key={key}
									type="button"
									aria-pressed={active}
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
									{tc(`category.${key}`)}
									<span
										className="text-[9px] px-1 py-0.5 rounded-full font-semibold tabular-nums"
										style={{
											background: active
												? "rgba(255,255,255,0.25)"
												: "var(--border)",
											color: active ? "white" : "var(--text-muted)",
										}}
									>
										{stats.counts[key]}
									</span>
								</button>
							);
						},
					)}
				</div>
			</WindowHero>

			<div className="flex-1 overflow-auto px-5 py-4">
				{visible.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<p className="text-2xl mb-2" aria-hidden="true">
							🗂️
						</p>
						<p className="text-sm text-(--text-muted)">{tc("noProjects")}</p>
					</div>
				) : (
					<ul className="grid grid-cols-1 gap-3">
						{visible.map((project) => (
							<li key={project.slug}>
								<ContentCard item={project} onOpen={openProject} />
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
