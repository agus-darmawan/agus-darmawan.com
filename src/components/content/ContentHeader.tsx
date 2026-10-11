import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { GithubIcon } from "@/features/icons/BrandIcons";
import type { ContentMeta } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
	accentStyle,
	Chip,
	ContentIcon,
	MetaRow,
	type MetaRowLabels,
	TagList,
} from "./primitives";

/** Shared label builder so cards, windows and pages show identical metadata. */
export function useMetaLabels(
	item: ContentMeta,
	month: "short" | "long" = "short",
): MetaRowLabels {
	const t = useTranslations("Content");
	const locale = useLocale();
	const isProject = item.kind === "project";
	return {
		date: item.date ? formatDate(item.date, locale, month) : undefined,
		readTime: isProject ? undefined : t("readTime", { min: item.readingTime }),
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
					className={cn(base, "bg-(--accent) text-white hover:opacity-85")}
				>
					<ExternalLink size={icon} aria-hidden="true" />
					{t("demo")}
				</a>
			)}
		</div>
	);
}

interface ContentHeaderProps {
	item: ContentMeta;
	/** h1 on standalone pages, h2 inside desktop windows. */
	as?: "h1" | "h2";
	/** Slot above the title (e.g. back button / breadcrumb). */
	leading?: ReactNode;
	className?: string;
}

/** Detail header used by the project README window, blog detail and SEO pages. */
export function ContentHeader({
	item,
	as: Heading = "h2",
	leading,
	className,
}: ContentHeaderProps) {
	const t = useTranslations("Content");
	const labels = useMetaLabels(item, "long");
	const isPage = Heading === "h1";

	return (
		<header
			style={accentStyle(item.color)}
			className={cn(
				"border-b border-(--border) bg-linear-to-br from-(--accent)/8 to-transparent to-60%",
				isPage ? "px-5 sm:px-8 py-6" : "px-5 py-4",
				className,
			)}
		>
			{leading}

			<div className="flex items-start gap-3">
				<ContentIcon emoji={item.emoji} size={isPage ? "lg" : "sm"} />
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<Heading
							className={cn(
								"font-bold leading-snug text-(--text-primary)",
								isPage ? "text-2xl sm:text-3xl" : "text-sm",
							)}
						>
							{item.title}
						</Heading>
						{item.kind === "project" && item.featured && (
							<Chip>{t("featured")}</Chip>
						)}
						{item.kind === "project" && item.source === "github" && (
							<Chip variant="muted">
								<GithubIcon size={9} />
								{t("autoFromGithub")}
							</Chip>
						)}
					</div>
					<p
						className={cn(
							"mt-1 text-(--text-muted)",
							isPage ? "text-sm sm:text-base" : "text-[11px] line-clamp-2",
						)}
					>
						{item.description}
					</p>
				</div>
			</div>

			<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
				<div className="space-y-2">
					<MetaRow dateIso={item.date} labels={labels} />
					<TagList tags={item.tags} icon={item.kind === "blog"} />
				</div>
				<ContentLinks item={item} />
			</div>
		</header>
	);
}
