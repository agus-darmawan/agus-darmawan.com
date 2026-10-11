"use client";

import { type RefObject, useMemo } from "react";
import { accentStyle } from "@/components/content/primitives";
import { parseMdx } from "@/lib/markdown/parser";
import { MarkdownBlocks } from "./MarkdownBlocks";
import { TableOfContents } from "./TableOfContents";
import { useHeadingScroll } from "./useHeadingScroll";

interface MarkdownRendererProps {
	content: string;
	/** Exposed to every block as the `--accent` CSS variable. */
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
		<div className="flex gap-5 min-w-0" style={accentStyle(accentColor)}>
			<div className="flex-1 min-w-0">
				<MarkdownBlocks tokens={tokens} />
			</div>
			<TableOfContents
				entries={toc}
				activeId={activeId}
				onNavigate={navigateTo}
			/>
		</div>
	);
}
