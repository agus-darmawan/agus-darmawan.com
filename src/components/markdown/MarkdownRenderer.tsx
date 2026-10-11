"use client";

import { type RefObject, useMemo } from "react";
import { accentStyle } from "@/components/content/primitives";
import { parseMdx } from "@/lib/markdown/parser";
import { MarkdownBlocks } from "./MarkdownBlocks";
import { MARKDOWN_STYLES, type MarkdownSize } from "./styles";
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
	/** compact (desktop windows, default) or comfortable (article pages). */
	size?: MarkdownSize;
}

export function MarkdownRenderer({
	content,
	accentColor,
	scrollRef,
	size = "compact",
}: MarkdownRendererProps) {
	const styles = MARKDOWN_STYLES[size];
	const { tokens, toc } = useMemo(() => parseMdx(content), [content]);
	const { activeId, navigateTo } = useHeadingScroll(scrollRef ?? null, toc);

	return (
		<div className={styles.layout} style={accentStyle(accentColor)}>
			<div className={styles.body}>
				<MarkdownBlocks tokens={tokens} size={size} />
			</div>
			<TableOfContents
				entries={toc}
				activeId={activeId}
				onNavigate={navigateTo}
				size={size}
			/>
		</div>
	);
}
