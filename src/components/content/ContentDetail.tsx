"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef } from "react";
import { MarkdownContent } from "@/components/markdown/MarkdownContent";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { useHeadingScroll } from "@/components/markdown/useHeadingScroll";
import type { ContentMeta } from "@/lib/content/types";
import type { MarkdownDoc, TocEntry } from "@/lib/markdown/types";
import { itemKey } from "@/lib/meta/keys";
import type { ApiResponse } from "@/types/api";
import { Banner } from "./banner/Banner";
import { ContentLinks, useMetaLabels } from "./ContentHeader";
import { CopyLinkButton } from "./CopyLinkButton";
import { accentStyle, MetaRow, TagList } from "./primitives";
import { ItemStats, LikeButton } from "./stats/ItemStats";
import { useItemCounts } from "./stats/useStats";

async function fetchDoc(
	locale: string,
	item: ContentMeta,
	signal: AbortSignal,
): Promise<MarkdownDoc> {
	const res = await fetch(
		`/api/content/${locale}/${item.kind}/${encodeURIComponent(item.slug)}`,
		{ signal },
	);
	const json = (await res.json()) as ApiResponse<MarkdownDoc>;
	if (!res.ok || !json.success || !json.data) throw new Error(json.error);
	return json.data;
}

/** The body, parsed and highlighted on the server. Cached per locale/slug. */
function useContentDoc(item: ContentMeta) {
	const locale = useLocale();
	return useQuery({
		queryKey: ["content", locale, item.kind, item.slug],
		queryFn: ({ signal }) => fetchDoc(locale, item, signal),
		staleTime: 60 * 60 * 1000,
	});
}

const NO_TOC: TocEntry[] = [];

interface ContentDetailProps {
	item: ContentMeta;
	/** Left of the toolbar (e.g. "← All posts"). */
	leading?: ReactNode;
}

/**
 * A project or post inside a desktop window: the website's article at a
 * compact size, with its contents beside it when the window is wide enough.
 */
export function ContentDetail({ item, leading }: ContentDetailProps) {
	const t = useTranslations("Content");
	const scrollRef = useRef<HTMLDivElement>(null);
	const { data: doc, isPending, isError } = useContentDoc(item);
	const toc = doc?.toc ?? NO_TOC;
	const { activeId, navigateTo } = useHeadingScroll(scrollRef, toc);
	const labels = useMetaLabels(item, "long", true);
	const key = itemKey(item);
	const { data: counts } = useItemCounts(key);

	// In-page links of the article (headings, footnotes) scroll the window,
	// not the desktop, and leave the page URL alone. The contents list
	// handles its own clicks.
	useEffect(() => {
		const body = scrollRef.current;
		if (!body) return;
		const onClick = (e: MouseEvent) => {
			const link = (e.target as Element | null)?.closest(".md a");
			const href = link?.getAttribute("href");
			if (!href?.startsWith("#") || e.metaKey || e.ctrlKey) return;
			e.preventDefault();
			navigateTo(decodeURIComponent(href.slice(1)));
		};
		body.addEventListener("click", onClick);
		return () => body.removeEventListener("click", onClick);
	}, [navigateTo]);

	return (
		<div className="flex h-full flex-col bg-(--window-bg) text-(--text-primary)">
			<div className="flex shrink-0 items-center justify-between gap-3 border-b border-(--border) px-5 py-2.5">
				{leading}
				<CopyLinkButton item={item} />
			</div>

			<div
				ref={scrollRef}
				style={accentStyle(item.color)}
				className="@container min-h-0 flex-1 overflow-auto"
			>
				<div className="mx-auto max-w-[58rem] px-5 pb-10 pt-5">
					<Banner item={item} aspect={4} sizes="58rem" className="rounded-lg" />

					<header className="mt-5 max-w-[42rem]">
						<h2 className="text-xl font-medium leading-snug text-balance">
							{item.title}
						</h2>
						<p className="mt-1.5 text-[0.8125rem] leading-relaxed text-(--text-secondary)">
							{item.description}
						</p>
						<MetaRow
							dateIso={item.date}
							labels={labels}
							className="mt-3 gap-x-4 gap-y-1.5 text-[0.6875rem] [&_svg]:size-3"
						>
							<ItemStats item={key} />
						</MetaRow>
						<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
							<TagList tags={item.tags} variant="muted" />
							<ContentLinks item={item} size="sm" />
						</div>
					</header>

					<div className="mt-6 grid gap-x-10 border-t border-(--border) pt-6 @3xl:grid-cols-[minmax(0,1fr)_11rem]">
						<TableOfContents
							entries={toc}
							activeId={activeId}
							onNavigate={navigateTo}
							className="sticky top-4 hidden self-start text-[0.75rem] @3xl:col-start-2 @3xl:row-start-1 @3xl:block"
						/>
						<div className="min-w-0 @3xl:col-start-1 @3xl:row-start-1">
							{isPending ? (
								<div className="flex justify-center py-16">
									<Loader2
										size={22}
										aria-label={t("loading")}
										className="animate-spin text-(--accent)"
									/>
								</div>
							) : isError ? (
								<p className="py-8 text-center text-xs text-(--text-muted)">
									{t("loadFailed")}
								</p>
							) : (
								<>
									<MarkdownContent tree={doc.tree} size="compact" />
									{counts && (
										<div className="mt-10 border-t border-(--border) pt-6">
											<LikeButton item={key} />
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
