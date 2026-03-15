"use client";

import { useMemo, useRef } from "react";
import { useReadmeScroll } from "@/hooks/project/useReadmeScroll";
import { parseMdx } from "@/lib/mdx-parser";
import { ReadmeBlocks } from "./ReadmeBlocks";
import { TableOfContents } from "./TableOfContents";

interface ReadmeRendererProps {
	content: string;
	accentColor: string;
	/**
	 * The scrollable container ref — must be the element that actually scrolls
	 * (has overflow-auto/scroll). TOC tracking listens to scroll events on this.
	 * If omitted, ReadmeRenderer creates its own inner ref.
	 */
	scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export function ReadmeRenderer({
	content,
	accentColor,
	scrollRef,
}: ReadmeRendererProps) {
	const { tokens, toc } = useMemo(() => parseMdx(content), [content]);
	const innerRef = useRef<HTMLDivElement>(null);

	// Always use the external scrollRef when provided — that's the element
	// that fires scroll events. Falling back to innerRef means ReadmeRenderer
	// itself would need to scroll, which only works when it fills its container.
	const activeScrollRef = scrollRef ?? innerRef;
	const { activeId, navigateTo } = useReadmeScroll(activeScrollRef, toc);

	return (
		<div className="flex gap-5 min-w-0">
			{/* Content — attach innerRef only when no external scrollRef is given */}
			<div ref={scrollRef ? undefined : innerRef} className="flex-1 min-w-0">
				<ReadmeBlocks tokens={tokens} accentColor={accentColor} />
			</div>

			{/* TOC — only renders when there are 2+ headings */}
			{toc.length >= 2 && (
				<TableOfContents
					entries={toc}
					accentColor={accentColor}
					activeId={activeId}
					onNavigate={navigateTo}
				/>
			)}
		</div>
	);
}
