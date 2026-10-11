import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { Link } from "@/i18n/navigation";
import { contentPath } from "@/lib/content/paths";
import type { ProjectMeta } from "@/lib/content/types";
import { ITEM_TITLE } from "../typography";

const MAX_TAGS = 5;

/**
 * One project in a typographic index: accent tile, title, one-paragraph
 * description, stack. The whole row is the link (stretched title link).
 */
export function ProjectRow({
	project,
	headingLevel = 2,
}: {
	project: ProjectMeta;
	headingLevel?: 2 | 3;
}) {
	const t = useTranslations("Content");
	const site = useTranslations("Site");
	const Heading = headingLevel === 2 ? "h2" : "h3";

	return (
		<article
			style={accentStyle(project.color)}
			className="group relative grid grid-cols-[auto_1fr] gap-x-4 py-6 sm:gap-x-5"
		>
			<span
				aria-hidden="true"
				className="grid size-11 place-items-center rounded-xl bg-(--accent)/12 text-xl transition-colors duration-200 group-hover:bg-(--accent)/22 sm:size-12"
			>
				{project.emoji}
			</span>

			<div className="min-w-0">
				<div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-6">
					<Heading className={ITEM_TITLE}>
						<Link
							href={contentPath(project)}
							className="decoration-(--accent) decoration-2 underline-offset-[5px] after:absolute after:inset-0 after:content-[''] group-hover:underline"
						>
							{project.title}
						</Link>
					</Heading>
					<p className="flex items-center gap-3 text-[0.8125rem] text-(--site-muted)">
						{project.featured && (
							<span className="text-(--site-link)">
								{site("projects.featured")}
							</span>
						)}
						<span>{t(`category.${project.category}`)}</span>
					</p>
				</div>

				<p className="mt-1.5 max-w-[65ch] leading-relaxed">
					{project.description}
				</p>

				<div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-3">
					<ul className="flex flex-wrap gap-1.5">
						{project.tags.slice(0, MAX_TAGS).map((tag) => (
							<li
								key={tag}
								className="rounded-md bg-(--site-raised) px-2 py-0.5 text-xs text-(--site-muted)"
							>
								{tag}
							</li>
						))}
					</ul>
					{project.stars !== null && project.stars > 0 && (
						<span className="flex items-center gap-1 text-[0.8125rem] tabular-nums text-(--site-muted)">
							<Star className="size-3.5" aria-hidden />
							{t("stars", { count: project.stars })}
						</span>
					)}
				</div>
			</div>
		</article>
	);
}
