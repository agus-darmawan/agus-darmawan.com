"use client";

import { type RefObject, useMemo } from "react";
import { parseMdx } from "@/lib/markdown/parser";
import { MarkdownBlocks } from "./MarkdownBlocks";
import { TableOfContents } from "./TableOfContents";
import { useHeadingScroll } from "./useHeadingScroll";

interface MarkdownRendererProps {
	content: string;
	accentColor: string;
	/**
	 * The element that actually scrolls (desktop window body). Omit it on
	 * standalone pages — the TOC then follows the page scroll.
	 */
	scrollRef?: RefObject<HTMLElement | null>;
}

export function MarkdownRenderer({
	content,
	accentColor,
	scrollRef,
}: MarkdownRendererProps) {
	const { tokens, toc } = useMemo(() => parseMdx(content), [content]);
	const { activeId, navigateTo } = useHeadingScroll(scrollRef ?? null, toc);

	return (
		<div className="flex gap-5 min-w-0">
			<div className="flex-1 min-w-0">
				<MarkdownBlocks tokens={tokens} accentColor={accentColor} />
			</div>

			<TableOfContents
				entries={toc}
				accentColor={accentColor}
				activeId={activeId}
				onNavigate={navigateTo}
			/>
		</div>
	);
}
