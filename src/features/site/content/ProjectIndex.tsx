"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { StatsScope } from "@/components/content/stats/ItemStats";
import type { ProjectCategory, ProjectMeta } from "@/lib/content/types";
import { itemKey } from "@/lib/meta/keys";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { matches, SearchField } from "./SearchField";

const CATEGORIES: ProjectCategory[] = ["robotics", "web", "research"];

/**
 * All projects as a grid, with a category filter and a search. Rendered on
 * the server with every project visible; filtering only starts after
 * hydration.
 */
export function ProjectIndex({ projects }: { projects: ProjectMeta[] }) {
	const t = useTranslations("Content");
	const site = useTranslations("Site.projects");
	const [category, setCategory] = useState<ProjectCategory | null>(null);
	const [query, setQuery] = useState("");
	const keys = useMemo(() => projects.map(itemKey), [projects]);

	const options = [
		{ value: null, label: t("category.all"), count: projects.length },
		...CATEGORIES.map((value) => ({
			value,
			label: t(`category.${value}`),
			count: projects.filter((p) => p.category === value).length,
		})).filter((o) => o.count > 0),
	];
	const visible = projects.filter(
		(p) => (!category || p.category === category) && matches(p, query),
	);

	return (
		<StatsScope items={keys}>
			<div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
				<fieldset className="flex flex-wrap gap-2">
					<legend className="sr-only">{site("filter")}</legend>
					{options.map(({ value, label, count }) => {
						const active = value === category;
						return (
							<button
								key={value ?? "all"}
								type="button"
								aria-pressed={active}
								onClick={() => setCategory(value)}
								className={cn(
									"inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-[0.8125rem] transition-colors",
									active
										? "border-transparent bg-(--site-primary) text-(--site-on-primary)"
										: "border-(--site-line) text-(--site-text) hover:border-(--site-ink)",
								)}
							>
								{label}
								<span
									className={cn(
										"tabular-nums",
										!active && "text-(--site-muted)",
									)}
								>
									{count}
								</span>
							</button>
						);
					})}
				</fieldset>
				<SearchField value={query} onChange={setQuery} label={site("search")} />
			</div>

			{visible.length > 0 ? (
				<ul className="grid gap-x-10 gap-y-14 md:grid-cols-2">
					{visible.map((project) => (
						<li key={project.slug}>
							<ProjectCard project={project} />
						</li>
					))}
				</ul>
			) : (
				<p className="border-t border-(--site-line) py-10 text-(--site-muted)">
					{query ? site("noMatch", { query: query.trim() }) : site("empty")}
				</p>
			)}
		</StatsScope>
	);
}
