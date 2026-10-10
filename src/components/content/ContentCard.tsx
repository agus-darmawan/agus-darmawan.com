"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { Link } from "@/i18n/navigation";
import { contentPath } from "@/lib/content/paths";
import type { ContentMeta } from "@/lib/content/types";
import { ContentLinks, useMetaLabels } from "./ContentHeader";
import { accentStyle, Chip, ContentIcon, MetaRow, TagList } from "./primitives";

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

/** One card for projects AND posts — the differences are data-driven. */
export function ContentCard({ item, onOpen }: ContentCardProps) {
	const t = useTranslations("Content");
	const labels = useMetaLabels(item);
	const isProject = item.kind === "project";

	return (
		<article
			style={accentStyle(item.color)}
			className="group relative w-full rounded-2xl overflow-hidden transition-all duration-200 bg-(--surface-secondary) border border-(--border) hover:border-(--accent)/40 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_color-mix(in_srgb,var(--accent)_14%,transparent)] focus-within:border-(--accent)/60"
		>
			{/* Accent bar */}
			<div
				aria-hidden="true"
				className={
					!isProject || item.featured
						? "h-0.5 w-full bg-linear-to-r from-(--accent) to-(--accent)/25"
						: "h-0.5 w-full bg-(--accent)/25"
				}
			/>

			<div className="relative p-4">
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-start gap-3 min-w-0">
						<ContentIcon
							emoji={item.emoji}
							size={isProject ? "md" : "sm"}
							className="transition-transform duration-200 group-hover:scale-110"
						/>
						<div className="min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h3 className="font-semibold text-sm leading-snug text-(--text-primary)">
									{/* Stretched link: the whole card is clickable, inner
									    links sit above it with `relative z-10`. */}
									<Link
										href={contentPath(item)}
										onClick={(e) => {
											if (!onOpen || isModified(e)) return;
											e.preventDefault();
											onOpen(item);
										}}
										className="outline-none after:absolute after:inset-0 after:content-['']"
									>
										{item.title}
									</Link>
								</h3>
								{isProject && item.featured && <Chip>{t("featured")}</Chip>}
							</div>
							{isProject ? (
								<span className="text-[10px] mt-0.5 inline-block text-(--text-muted)">
									{t(`category.${item.category}`)}
								</span>
							) : (
								<p className="text-[11px] mt-0.5 line-clamp-2 leading-relaxed text-(--text-secondary)">
									{item.description}
								</p>
							)}
						</div>
					</div>

					<span
						aria-hidden="true"
						className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 bg-(--accent)/10 text-(--accent)"
					>
						<ArrowUpRight size={14} />
					</span>
				</div>

				{isProject && (
					<p className="text-xs leading-relaxed mb-3 line-clamp-2 text-(--text-secondary)">
						{item.description}
					</p>
				)}

				<TagList
					className="mb-3"
					tags={item.tags}
					max={isProject ? 4 : undefined}
					variant={isProject ? "muted" : "accent"}
					moreLabel={(count) => t("moreTags", { count })}
				/>

				<div className="flex items-center justify-between gap-2">
					<MetaRow dateIso={item.date} labels={labels} />
					<ContentLinks item={item} size="sm" />
				</div>
			</div>
		</article>
	);
}
