import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { GithubIcon } from "@/features/icons/BrandIcons";
import type { ContentMeta } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MetaRowLabels } from "./primitives";

/** Shared label builder so cards, windows and pages show identical metadata. */
export function useMetaLabels(
	item: ContentMeta,
	month: "short" | "long" = "short",
	/** Reading time for projects too (it's always shown for posts). */
	projectReadTime = false,
): MetaRowLabels {
	const t = useTranslations("Content");
	const locale = useLocale();
	const isProject = item.kind === "project";
	return {
		date: item.date ? formatDate(item.date, locale, month) : undefined,
		readTime:
			isProject && !projectReadTime
				? undefined
				: t("readTime", { min: item.readingTime }),
		stars:
			isProject && item.stars !== null
				? t("stars", { count: item.stars })
				: undefined,
		forks:
			isProject && item.forks ? t("forks", { count: item.forks }) : undefined,
	};
}

/** "Code" / "Live demo" buttons — only rendered when the target exists. */
const LINK_SIZES = {
	sm: { box: "text-[10px] px-2 py-1", icon: 10 },
	md: { box: "text-xs px-3 py-1.5", icon: 13 },
	lg: { box: "text-sm h-10 px-4", icon: 15 },
} as const;

export function ContentLinks({
	item,
	size = "md",
}: {
	item: ContentMeta;
	size?: keyof typeof LINK_SIZES;
}) {
	const t = useTranslations("Content");
	if (item.kind !== "project" || (!item.repoUrl && !item.demo)) return null;

	const base = cn(
		"relative z-10 inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors",
		LINK_SIZES[size].box,
	);
	const icon = LINK_SIZES[size].icon;

	return (
		<div className="flex items-center gap-1.5 shrink-0">
			{item.repoUrl && (
				<a
					href={item.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`${t("viewOnGithub")}: ${item.title}`}
					className={cn(
						base,
						"border border-(--border) text-(--text-secondary) hover:border-(--accent) hover:text-(--accent)",
					)}
				>
					<GithubIcon size={icon} />
					{t("code")}
				</a>
			)}
			{item.demo && (
				<a
					href={item.demo}
					target="_blank"
					rel="noopener noreferrer"
					// Ink on paper, not white on the accent: some accents are too
					// light for white text.
					className={cn(
						base,
						"bg-(--text-primary) text-(--surface) hover:opacity-85",
					)}
				>
					<ExternalLink size={icon} aria-hidden="true" />
					{t("demo")}
				</a>
			)}
		</div>
	);
}
