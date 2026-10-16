"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { TableOfContents } from "@/components/markdown/TableOfContents";
import { useHeadingScroll } from "@/components/markdown/useHeadingScroll";
import type { TocEntry } from "@/lib/markdown/types";

/**
 * The article's sections: a sticky list beside the text on wide screens,
 * a "Contents" disclosure above it on narrow ones.
 */
export function ArticleToc({ toc }: { toc: TocEntry[] }) {
	const t = useTranslations("Content");
	const { activeId, navigateTo } = useHeadingScroll(null, toc);
	if (toc.length < 2) return null;

	return (
		<>
			<details className="group mb-10 rounded-xl border border-(--site-line) lg:hidden">
				<summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-(--site-ink) [&::-webkit-details-marker]:hidden">
					{t("tableOfContents")}
					<ChevronDown
						aria-hidden="true"
						className="size-4 text-(--site-muted) transition-transform group-open:rotate-180"
					/>
				</summary>
				<TableOfContents
					entries={toc}
					activeId={activeId}
					onNavigate={navigateTo}
					hideTitle
					className="px-4 pb-4 text-[0.875rem]"
				/>
			</details>
			<TableOfContents
				entries={toc}
				activeId={activeId}
				onNavigate={navigateTo}
				className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto text-[0.8125rem] lg:block"
			/>
		</>
	);
}
