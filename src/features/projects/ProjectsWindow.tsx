"use client";

import { Folder } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useContent } from "@/components/content/ContentProvider";
import {
	type ContentFilter,
	ContentWindow,
} from "@/components/content/ContentWindow";
import type { ProjectCategory, ProjectMeta } from "@/lib/content/types";

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
	web: "#3b82f6",
	robotics: "#10b981",
	research: "#8b5cf6",
};

export default function ProjectsWindow() {
	const t = useTranslations("ProjectsWindow");
	const tc = useTranslations("Content");
	const { projects } = useContent();

	const featured = projects.filter((p) => p.featured).length;
	// Only real numbers from GitHub — no invented fallbacks.
	const stars = projects.reduce((sum, p) => sum + (p.stars ?? 0), 0);

	const filter = useMemo<ContentFilter<ProjectMeta>>(
		() => ({
			label: tc("categoryLabel"),
			mode: "single",
			allLabel: tc("category.all"),
			options: (Object.keys(CATEGORY_COLORS) as ProjectCategory[]).map(
				(category) => ({
					value: category,
					label: tc(`category.${category}`),
					color: CATEGORY_COLORS[category],
				}),
			),
			match: (project, category) => project.category === category,
		}),
		[tc],
	);

	return (
		<ContentWindow
			items={projects}
			filter={filter}
			emptyIcon="🗂️"
			hero={{
				accent: "#e95420",
				decoration: "arcs",
				icon: <Folder size={16} className="text-white" />,
				title: t("title"),
				subtitle: tc("projectsSummary", { count: projects.length, featured }),
				description: t("headerDesc"),
				stats: [
					...(stars > 0 ? [{ value: stars, label: t("stars") }] : []),
					{ value: projects.length, label: t("repos") },
				],
			}}
			labels={{
				search: t("searchPlaceholder"),
				list: t("listLabel"),
				empty: t("noResults"),
				back: tc("backToProjects"),
			}}
		/>
	);
}
