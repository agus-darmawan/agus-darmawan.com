"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ProjectCategory, ProjectMeta } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { ProjectRow } from "./ProjectRow";

const CATEGORIES: ProjectCategory[] = ["robotics", "web", "research"];

/**
 * All projects with a category filter. Rendered on the server with every
 * project visible; the filter only narrows the list after hydration.
 */
export function ProjectIndex({ projects }: { projects: ProjectMeta[] }) {
	const t = useTranslations("Content");
	const site = useTranslations("Site.projects");
	const [category, setCategory] = useState<ProjectCategory | null>(null);

	const options = [
		{ value: null, label: t("category.all"), count: projects.length },
		...CATEGORIES.map((value) => ({
			value,
			label: t(`category.${value}`),
			count: projects.filter((p) => p.category === value).length,
		})).filter((o) => o.count > 0),
	];
	const visible = category
		? projects.filter((p) => p.category === category)
		: projects;

	return (
		<>
			<fieldset className="flex flex-wrap gap-2 pb-6">
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
								"inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
								active
									? "border-transparent bg-(--site-primary) text-(--site-on-primary)"
									: "border-(--site-line) text-(--site-text) hover:border-(--site-ink)",
							)}
						>
							{label}
							<span
								className={cn("tabular-nums", !active && "text-(--site-muted)")}
							>
								{count}
							</span>
						</button>
					);
				})}
			</fieldset>

			{visible.length > 0 ? (
				<ul className="border-t border-(--site-line)">
					{visible.map((project) => (
						<li key={project.slug} className="border-b border-(--site-line)">
							<ProjectRow project={project} />
						</li>
					))}
				</ul>
			) : (
				<p className="border-t border-(--site-line) py-10 text-(--site-muted)">
					{site("empty")}
				</p>
			)}
		</>
	);
}
