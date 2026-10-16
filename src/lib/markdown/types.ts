import type { Root } from "hast";

/** A section of the article in the table of contents. */
export interface TocEntry {
	id: string;
	text: string;
	level: 2 | 3;
}

/**
 * A Markdown body prepared on the server: parsed, sanitized and highlighted
 * once, then rendered as-is by the website pages and the desktop windows.
 * Plain JSON, so it can travel through the content API.
 */
export interface MarkdownDoc {
	tree: Root;
	toc: TocEntry[];
}

/** Elements the renderer swaps for components (`<div data-component>`). */
export type CalloutKind = "note" | "tip" | "important" | "warning" | "caution";
