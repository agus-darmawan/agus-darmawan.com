import type { InlineNode, TocEntry, Token } from "@/types/project";

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-");
}

function extractText(nodes: InlineNode[]): string {
	return nodes
		.map((n) => {
			if (n.type === "text") return n.value;
			if (n.type === "bold" || n.type === "italic" || n.type === "link")
				return extractText(n.children);
			if (n.type === "code") return n.value;
			return "";
		})
		.join("");
}

/** Extract YouTube video ID from various URL formats */
function extractYoutubeId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
		/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
	];
	for (const p of patterns) {
		const m = url.match(p);
		if (m) return m[1];
	}
	return null;
}

// ── Inline parser ─────────────────────────────────────────────────────────────

export function parseInline(text: string): InlineNode[] {
	const nodes: InlineNode[] = [];
	let i = 0;

	while (i < text.length) {
		// Inline image: ![alt](src)
		if (text[i] === "!" && text[i + 1] === "[") {
			const closeAlt = text.indexOf("]", i + 2);
			if (closeAlt !== -1 && text[closeAlt + 1] === "(") {
				const closeSrc = text.indexOf(")", closeAlt + 2);
				if (closeSrc !== -1) {
					const alt = text.slice(i + 2, closeAlt);
					const src = text.slice(closeAlt + 2, closeSrc);
					nodes.push({ type: "image", src, alt });
					i = closeSrc + 1;
					continue;
				}
			}
		}

		// Link: [text](href)
		if (text[i] === "[") {
			const closeLabel = text.indexOf("]", i + 1);
			if (closeLabel !== -1 && text[closeLabel + 1] === "(") {
				const closeHref = text.indexOf(")", closeLabel + 2);
				if (closeHref !== -1) {
					const label = text.slice(i + 1, closeLabel);
					const href = text.slice(closeLabel + 2, closeHref);
					nodes.push({ type: "link", href, children: parseInline(label) });
					i = closeHref + 1;
					continue;
				}
			}
		}

		// Bold **text** or __text__
		if (
			(text[i] === "*" && text[i + 1] === "*") ||
			(text[i] === "_" && text[i + 1] === "_")
		) {
			const marker = text.slice(i, i + 2);
			const end = text.indexOf(marker, i + 2);
			if (end !== -1) {
				nodes.push({
					type: "bold",
					children: parseInline(text.slice(i + 2, end)),
				});
				i = end + 2;
				continue;
			}
		}

		// Italic *text* or _text_
		if (text[i] === "*" || text[i] === "_") {
			const marker = text[i];
			const end = text.indexOf(marker, i + 1);
			if (end !== -1 && end > i + 1) {
				nodes.push({
					type: "italic",
					children: parseInline(text.slice(i + 1, end)),
				});
				i = end + 1;
				continue;
			}
		}

		// Inline code `code`
		if (text[i] === "`") {
			const end = text.indexOf("`", i + 1);
			if (end !== -1) {
				nodes.push({ type: "code", value: text.slice(i + 1, end) });
				i = end + 1;
				continue;
			}
		}

		// Plain text — accumulate until a special char
		let j = i + 1;
		while (j < text.length) {
			const c = text[j];
			if (c === "*" || c === "_" || c === "`" || c === "[" || c === "!") break;
			j++;
		}
		nodes.push({ type: "text", value: text.slice(i, j) });
		i = j;
	}

	return nodes;
}

// ── Block parser ──────────────────────────────────────────────────────────────

export function parseMdx(raw: string): { tokens: Token[]; toc: TocEntry[] } {
	const lines = raw.split("\n");
	const tokens: Token[] = [];
	const toc: TocEntry[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// Fenced code block ```lang
		if (line.trimStart().startsWith("```")) {
			const lang = line.replace(/^```/, "").trim();
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
				codeLines.push(lines[i]);
				i++;
			}
			tokens.push({ type: "code_block", lang, code: codeLines.join("\n") });
			i++;
			continue;
		}

		// Blockquote > ...
		if (line.startsWith("> ")) {
			const bqLines: string[] = [];
			while (i < lines.length && lines[i].startsWith("> ")) {
				bqLines.push(lines[i].slice(2));
				i++;
			}
			const { tokens: inner } = parseMdx(bqLines.join("\n"));
			tokens.push({ type: "blockquote", children: inner });
			continue;
		}

		// Table: line with | and next line with ---
		if (line.includes("|") && lines[i + 1]?.match(/^\|?[\s-|]+\|?$/)) {
			const parseRow = (r: string) =>
				r
					.split("|")
					.map((c) => c.trim())
					.filter(Boolean)
					.map((c) => parseInline(c));

			const headers = parseRow(line);
			i += 2; // skip header + separator
			const rows: InlineNode[][][] = [];
			while (i < lines.length && lines[i].includes("|")) {
				rows.push(parseRow(lines[i]));
				i++;
			}
			tokens.push({ type: "table", headers, rows });
			continue;
		}

		// Headings
		const hMatch = line.match(/^(#{1,3})\s+(.+)/);
		if (hMatch) {
			const level = hMatch[1].length as 1 | 2 | 3;
			const children = parseInline(hMatch[2]);
			const text = extractText(children);
			const id = slugify(text);
			if (level === 1) tokens.push({ type: "h1", id, children });
			else if (level === 2) tokens.push({ type: "h2", id, children });
			else tokens.push({ type: "h3", id, children });
			if (level <= 3) toc.push({ id, text, level });
			i++;
			continue;
		}

		// HR ---
		if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
			tokens.push({ type: "hr" });
			i++;
			continue;
		}

		// Unordered list - item
		if (/^(\s*[-*+])\s/.test(line)) {
			const items: InlineNode[][] = [];
			while (i < lines.length && /^(\s*[-*+])\s/.test(lines[i])) {
				items.push(parseInline(lines[i].replace(/^\s*[-*+]\s/, "")));
				i++;
			}
			tokens.push({ type: "ul", items });
			continue;
		}

		// Ordered list 1. item
		if (/^\d+\.\s/.test(line)) {
			const items: InlineNode[][] = [];
			while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
				items.push(parseInline(lines[i].replace(/^\d+\.\s/, "")));
				i++;
			}
			tokens.push({ type: "ol", items });
			continue;
		}

		// Blank line
		if (line.trim() === "") {
			tokens.push({ type: "blank" });
			i++;
			continue;
		}

		// Standalone image: ![alt](src "optional title")
		const imgMatch = line.match(
			/^!\[([^\]]*)\]\(([^)\s"]+)(?:\s+"([^"]*)")?\)$/,
		);
		if (imgMatch) {
			const [, alt, src, title] = imgMatch;

			// Check if it's a YouTube link
			const ytId = extractYoutubeId(src);
			if (ytId) {
				tokens.push({ type: "youtube", videoId: ytId, title: alt || title });
			} else {
				tokens.push({ type: "image", src, alt, title });
			}
			i++;
			continue;
		}

		// YouTube shortcode: ::youtube[title](videoId or URL)
		const ytShortcode = line.match(/^::youtube\[([^\]]*)\]\(([^)]+)\)$/);
		if (ytShortcode) {
			const [, title, idOrUrl] = ytShortcode;
			const videoId = extractYoutubeId(idOrUrl) ?? idOrUrl;
			tokens.push({ type: "youtube", videoId, title });
			i++;
			continue;
		}

		// Paragraph
		tokens.push({ type: "p", children: parseInline(line) });
		i++;
	}

	return { tokens, toc };
}
