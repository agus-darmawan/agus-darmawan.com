"use client";

import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { Link } from "@/i18n/navigation";
import { contentPath } from "@/lib/content/paths";
import type { ContentMeta } from "@/lib/content/types";
import { itemKey } from "@/lib/meta/keys";
import { Banner } from "./banner/Banner";
import { ContentLinks, useMetaLabels } from "./ContentHeader";
import { accentStyle, Chip, MetaRow, TagList } from "./primitives";
import { ViewCount } from "./stats/ItemStats";

interface ContentCardProps {
	item: ContentMeta;
	/**
	 * Open inside the desktop (window / in-window detail). The title stays a
	 * real link to the standalone page, so crawlers, middle-click and
	 * "open in new tab" still work.
	 */
	onOpen?: (item: ContentMeta) => void;
}

const isModified = (e: MouseEvent) =>
	e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

/**
 * One card for projects AND posts in the desktop windows: the item's banner
 * beside its title, summary, tags and facts (stacked in narrow windows).
 */
export function ContentCard({ item, onOpen }: ContentCardProps) {
	const t = useTranslations("Content");
	const labels = useMetaLabels(item);
	const isProject = item.kind === "project";

	return (
		<article
			style={accentStyle(item.color)}
			className="@container group relative rounded-xl border border-(--border) bg-(--surface-secondary) p-3 transition-colors hover:border-(--accent)/50 focus-within:border-(--accent)"
		>
			<div className="grid gap-3.5 @md:grid-cols-[9rem_minmax(0,1fr)]">
				<Banner
					item={item}
					aspect={16 / 9}
					sizes="9rem"
					className="rounded-lg"
				/>
				<div className="min-w-0 py-0.5">
					<div className="flex items-start justify-between gap-3">
						<h3 className="text-sm font-semibold leading-snug text-(--text-primary)">
							{/* Stretched link: the whole card is clickable, inner
							    links sit above it with `relative z-10`. */}
							<Link
								href={contentPath(item)}
								onClick={(e) => {
									if (!onOpen || isModified(e)) return;
									e.preventDefault();
									onOpen(item);
								}}
								className="outline-none after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-(--accent)"
							>
								{item.title}
							</Link>
						</h3>
						{isProject && item.featured && (
							<Chip className="shrink-0">{t("featured")}</Chip>
						)}
					</div>
					{isProject && (
						<p className="mt-0.5 text-[11px] text-(--text-muted)">
							{t(`category.${item.category}`)}
						</p>
					)}
					<p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-(--text-secondary)">
						{item.description}
					</p>
					<TagList
						className="mt-2.5"
						tags={item.tags}
						max={4}
						variant="muted"
						moreLabel={(count) => t("moreTags", { count })}
					/>
					<div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
						<MetaRow dateIso={item.date} labels={labels}>
							<ViewCount item={itemKey(item)} icon />
						</MetaRow>
						<ContentLinks item={item} size="sm" />
					</div>
				</div>
			</div>
		</article>
	);
}
