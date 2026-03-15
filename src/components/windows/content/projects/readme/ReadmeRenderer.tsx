"use client";

import { useMemo, useRef } from "react";
import { useReadmeScroll } from "@/hooks/project/useReadmeScroll";
import { parseMdx } from "@/lib/mdx-parser";
import { ReadmeBlocks } from "./ReadmeBlocks";
import { TableOfContents } from "./TableOfContents";

interface ReadmeRendererProps {
	content: string;
	accentColor: string;
	/** Pass the scrollable container ref from the parent if ReadmeRenderer itself isn't the scroller */
	scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export function ReadmeRenderer({
	content,
	accentColor,
	scrollRef,
}: ReadmeRendererProps) {
	const { tokens, toc } = useMemo(() => parseMdx(content), [content]);
	const innerRef = useRef<HTMLDivElement>(null);
	const containerRef = scrollRef ?? innerRef;
	const { activeId, navigateTo } = useReadmeScroll(containerRef, toc);

	return (
		<div className="flex gap-5">
			{/* Main content */}
			<div ref={scrollRef ? undefined : innerRef} className="flex-1 min-w-0">
				<ReadmeBlocks tokens={tokens} accentColor={accentColor} />
			</div>

			{/* TOC sidebar */}
			<TableOfContents
				entries={toc}
				accentColor={accentColor}
				activeId={activeId}
				onNavigate={navigateTo}
			/>
		</div>
	);
}
