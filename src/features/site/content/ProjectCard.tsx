import { useTranslations } from "next-intl";
import { Banner } from "@/components/content/banner/Banner";
import { accentStyle } from "@/components/content/primitives";
import { ViewCount } from "@/components/content/stats/ItemStats";
import { Link } from "@/i18n/navigation";
import { contentPath } from "@/lib/content/paths";
import type { ProjectMeta } from "@/lib/content/types";
import { itemKey } from "@/lib/meta/keys";
import { cn } from "@/lib/utils";
import { ITEM_TITLE } from "../typography";

const MAX_TAGS = 4;

/**
 * A project in the grid: banner, title, summary, facts, stack. No box
 * around it; the whole card is one link (stretched over the title).
 */
export function ProjectCard({
	project,
	headingLevel = 2,
	sizes = "(min-width: 768px) 34rem, 100vw",
}: {
	project: ProjectMeta;
	headingLevel?: 2 | 3;
	sizes?: string;
}) {
	const t = useTranslations("Content");
	const site = useTranslations("Site");
	const Heading = headingLevel === 2 ? "h2" : "h3";
	const hidden = project.tags.length - MAX_TAGS;

	return (
		<article style={accentStyle(project.color)} className="group relative">
			<Banner
				item={project}
				aspect={16 / 9}
				sizes={sizes}
				className="rounded-xl"
			/>
			<Heading className={cn(ITEM_TITLE, "mt-4 text-[1.125rem]")}>
				<Link
					href={contentPath(project)}
					className="decoration-(--accent) decoration-2 underline-offset-[5px] after:absolute after:inset-0 after:rounded-xl after:content-[''] group-hover:underline"
				>
					{project.title}
				</Link>
			</Heading>
			<p className="mt-1.5 line-clamp-3 leading-relaxed text-pretty">
				{project.description}
			</p>
			<p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-(--site-muted)">
				<span>{t(`category.${project.category}`)}</span>
				{project.featured && (
					<span className="text-(--site-link)">
						{site("projects.featured")}
					</span>
				)}
				{project.stars !== null && project.stars > 0 && (
					<span className="tabular-nums">
						{t("stars", { count: project.stars })}
					</span>
				)}
				<ViewCount item={itemKey(project)} />
			</p>
			<ul className="mt-3 flex flex-wrap gap-1.5">
				{project.tags.slice(0, MAX_TAGS).map((tag) => (
					<li
						key={tag}
						className="rounded-md bg-(--site-raised) px-2 py-0.5 text-xs text-(--site-muted)"
					>
						{tag}
					</li>
				))}
				{hidden > 0 && (
					<li className="px-1 py-0.5 text-xs text-(--site-muted)">
						{t("moreTags", { count: hidden })}
					</li>
				)}
			</ul>
		</article>
	);
}
