export interface TocEntry {
	id: string;
	text: string;
	level: 1 | 2 | 3;
}

// ── Inline nodes ─────────────────────────────────────────────────────────────

export type InlineNode =
	| { type: "text"; value: string }
	| { type: "bold"; children: InlineNode[] }
	| { type: "italic"; children: InlineNode[] }
	| { type: "code"; value: string }
	| { type: "link"; href: string; children: InlineNode[] }
	| { type: "image"; src: string; alt: string };

// ── Block tokens ─────────────────────────────────────────────────────────────

export type Token =
	| { type: "h1"; id: string; children: InlineNode[] }
	| { type: "h2"; id: string; children: InlineNode[] }
	| { type: "h3"; id: string; children: InlineNode[] }
	| { type: "p"; children: InlineNode[] }
	| { type: "blockquote"; children: Token[] }
	| { type: "code_block"; lang: string; code: string }
	| { type: "table"; headers: InlineNode[][]; rows: InlineNode[][][] }
	| { type: "ul"; items: InlineNode[][] }
	| { type: "ol"; items: InlineNode[][] }
	| { type: "hr" }
	| { type: "image"; src: string; alt: string; title?: string }
	| { type: "youtube"; videoId: string; title?: string }
	| { type: "blank" };
