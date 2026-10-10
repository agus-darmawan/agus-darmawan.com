"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useRef } from "react";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import type { ContentMeta } from "@/lib/content/types";
import type { ApiResponse } from "@/types/api";
import { ContentHeader } from "./ContentHeader";
import { CopyLinkButton } from "./CopyLinkButton";
import { accentStyle } from "./primitives";

async function fetchBody(
	locale: string,
	item: ContentMeta,
	signal: AbortSignal,
): Promise<string> {
	const res = await fetch(
		`/api/content/${locale}/${item.kind}/${encodeURIComponent(item.slug)}`,
		{ signal },
	);
	const json = (await res.json()) as ApiResponse<{ body: string }>;
	if (!res.ok || !json.success || !json.data) throw new Error(json.error);
	return json.data.body;
}

/** Lazily loads + renders a body. Cached per locale/slug by React Query. */
function useContentBody(item: ContentMeta) {
	const locale = useLocale();
	return useQuery({
		queryKey: ["content", locale, item.kind, item.slug],
		queryFn: ({ signal }) => fetchBody(locale, item, signal),
		staleTime: 60 * 60 * 1000,
	});
}

interface ContentDetailProps {
	item: ContentMeta;
	/** Rendered above the title (e.g. "← All posts"). */
	leading?: ReactNode;
}

/**
 * Detail view inside a desktop window — shared by the project README window
 * and the blog post view (they used to be two copy-pasted components).
 */
export function ContentDetail({ item, leading }: ContentDetailProps) {
	const t = useTranslations("Content");
	const scrollRef = useRef<HTMLDivElement>(null);
	const { data: body, isPending, isError } = useContentBody(item);

	return (
		<div className="h-full flex flex-col bg-(--window-bg) text-(--text-primary)">
			<ContentHeader
				item={item}
				className="shrink-0"
				leading={
					<div className="flex items-center justify-between gap-3 mb-3">
						{leading}
						<CopyLinkButton item={item} />
					</div>
				}
			/>

			<div
				ref={scrollRef}
				style={accentStyle(item.color)}
				className="flex-1 overflow-auto min-h-0 px-5 py-4"
			>
				{isPending ? (
					<div className="flex items-center justify-center py-16">
						<Loader2 size={22} className="animate-spin text-(--accent)" />
					</div>
				) : isError ? (
					<p className="text-xs py-8 text-center text-(--text-muted)">
						{t("loadFailed")}
					</p>
				) : (
					<MarkdownRenderer
						content={body}
						accentColor={item.color}
						scrollRef={scrollRef}
					/>
				)}
			</div>
		</div>
	);
}
