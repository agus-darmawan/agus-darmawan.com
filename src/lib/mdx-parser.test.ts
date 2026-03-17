import { describe, expect, it } from "vitest";
import { parseInline, parseMdx } from "./mdx-parser";

// ── parseInline ───────────────────────────────────────────────────────────────

describe("parseInline", () => {
	it("parses plain text", () => {
		const nodes = parseInline("hello world");
		expect(nodes).toEqual([{ type: "text", value: "hello world" }]);
	});

	it("parses bold **text**", () => {
		const nodes = parseInline("**bold**");
		expect(nodes[0]).toMatchObject({ type: "bold" });
	});

	it("parses italic *text*", () => {
		const nodes = parseInline("*italic*");
		expect(nodes[0]).toMatchObject({ type: "italic" });
	});

	it("parses inline code `code`", () => {
		const nodes = parseInline("`const x = 1`");
		expect(nodes[0]).toMatchObject({ type: "code", value: "const x = 1" });
	});

	it("parses link [label](href)", () => {
		const nodes = parseInline("[click here](https://example.com)");
		expect(nodes[0]).toMatchObject({
			type: "link",
			href: "https://example.com",
		});
	});

	it("parses inline image ![alt](src)", () => {
		const nodes = parseInline("![logo](https://example.com/logo.png)");
		expect(nodes[0]).toMatchObject({
			type: "image",
			src: "https://example.com/logo.png",
			alt: "logo",
		});
	});

	it("parses mixed inline content", () => {
		const nodes = parseInline("Hello **world** and `code`");
		expect(nodes).toHaveLength(4);
		expect(nodes[0]).toMatchObject({ type: "text", value: "Hello " });
		expect(nodes[1]).toMatchObject({ type: "bold" });
		expect(nodes[2]).toMatchObject({ type: "text", value: " and " });
		expect(nodes[3]).toMatchObject({ type: "code" });
	});
});

// ── parseMdx — headings ───────────────────────────────────────────────────────

describe("parseMdx — headings", () => {
	it("parses h1", () => {
		const { tokens, toc } = parseMdx("# Hello World");
		expect(tokens[0]).toMatchObject({ type: "h1" });
		expect(toc[0]).toMatchObject({ text: "Hello World", level: 1 });
	});

	it("parses h2", () => {
		const { tokens } = parseMdx("## Section");
		expect(tokens[0]).toMatchObject({ type: "h2" });
	});

	it("parses h3", () => {
		const { tokens } = parseMdx("### Subsection");
		expect(tokens[0]).toMatchObject({ type: "h3" });
	});

	it("generates slug from heading text", () => {
		const { toc } = parseMdx("## Getting Started");
		expect(toc[0].id).toBe("getting-started");
	});

	it("handles Indonesian characters in slugify", () => {
		const { toc } = parseMdx("## Pengembangan Sistem");
		expect(toc[0].id).toBe("pengembangan-sistem");
	});

	it("strips special chars from slug", () => {
		const { toc } = parseMdx("## Hello, World!");
		expect(toc[0].id).toBe("hello-world");
	});

	it("does not duplicate TOC entries for h4+", () => {
		const { toc } = parseMdx("# H1\n## H2\n### H3");
		expect(toc).toHaveLength(3);
	});
});

// ── parseMdx — blocks ─────────────────────────────────────────────────────────

describe("parseMdx — blocks", () => {
	it("parses paragraph", () => {
		const { tokens } = parseMdx("This is a paragraph.");
		expect(tokens[0]).toMatchObject({ type: "p" });
	});

	it("parses unordered list", () => {
		const { tokens } = parseMdx("- item 1\n- item 2\n- item 3");
		expect(tokens[0]).toMatchObject({ type: "ul" });
		expect((tokens[0] as { items: unknown[] }).items).toHaveLength(3);
	});

	it("parses ordered list", () => {
		const { tokens } = parseMdx("1. first\n2. second");
		expect(tokens[0]).toMatchObject({ type: "ol" });
	});

	it("parses fenced code block", () => {
		const { tokens } = parseMdx("```ts\nconst x = 1;\n```");
		expect(tokens[0]).toMatchObject({
			type: "code_block",
			lang: "ts",
			code: "const x = 1;",
		});
	});

	it("parses horizontal rule ---", () => {
		const { tokens } = parseMdx("---");
		expect(tokens[0]).toMatchObject({ type: "hr" });
	});

	it("parses horizontal rule ***", () => {
		const { tokens } = parseMdx("***");
		expect(tokens[0]).toMatchObject({ type: "hr" });
	});

	it("parses blockquote", () => {
		const { tokens } = parseMdx("> This is a quote");
		expect(tokens[0]).toMatchObject({ type: "blockquote" });
	});

	it("parses standalone image", () => {
		const { tokens } = parseMdx(
			'![screenshot](https://example.com/img.png "title")',
		);
		expect(tokens[0]).toMatchObject({
			type: "image",
			src: "https://example.com/img.png",
			alt: "screenshot",
			title: "title",
		});
	});

	it("parses YouTube shortcode", () => {
		const { tokens } = parseMdx("::youtube[Demo Video](dQw4w9WgXcQ)");
		expect(tokens[0]).toMatchObject({
			type: "youtube",
			videoId: "dQw4w9WgXcQ",
		});
	});

	it("extracts YouTube ID from full URL", () => {
		const { tokens } = parseMdx(
			"![video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
		);
		expect(tokens[0]).toMatchObject({
			type: "youtube",
			videoId: "dQw4w9WgXcQ",
		});
	});

	it("parses blank lines as blank tokens", () => {
		const { tokens } = parseMdx("paragraph\n\nanother");
		expect(tokens.some((t) => t.type === "blank")).toBe(true);
	});
});

// ── parseMdx — tables ─────────────────────────────────────────────────────────

describe("parseMdx — tables", () => {
	it("parses simple table", () => {
		const md = "| A | B |\n|---|---|\n| 1 | 2 |";
		const { tokens } = parseMdx(md);
		expect(tokens[0]).toMatchObject({ type: "table" });
		const table = tokens[0] as { headers: unknown[]; rows: unknown[][] };
		expect(table.headers).toHaveLength(2);
		expect(table.rows).toHaveLength(1);
	});
});

// ── parseMdx — TOC ────────────────────────────────────────────────────────────

describe("parseMdx — TOC", () => {
	it("builds TOC from multiple headings", () => {
		const md = "# Intro\n## Setup\n### Step 1\n## Usage";
		const { toc } = parseMdx(md);
		expect(toc).toHaveLength(4);
		expect(toc.map((e) => e.level)).toEqual([1, 2, 3, 2]);
	});

	it("returns empty TOC for no headings", () => {
		const { toc } = parseMdx("just some text\nno headings here");
		expect(toc).toHaveLength(0);
	});

	// Fix #10 — duplicate headings sekarang generate unique IDs
	it("handles duplicate heading text with unique IDs", () => {
		const { toc } = parseMdx("## Setup\n## Setup");
		expect(toc).toHaveLength(2);
		expect(toc[0].id).toBe("setup");
		expect(toc[1].id).toBe("setup-2"); // ← tidak lagi sama
		expect(toc[0].id).not.toBe(toc[1].id);
	});

	it("handles triplicate headings with sequential unique IDs", () => {
		const { toc } = parseMdx("## Intro\n## Intro\n## Intro");
		expect(toc[0].id).toBe("intro");
		expect(toc[1].id).toBe("intro-2");
		expect(toc[2].id).toBe("intro-3");
	});
});

// ── parseMdx — edge cases ─────────────────────────────────────────────────────

describe("parseMdx — edge cases", () => {
	it("handles empty string", () => {
		const { tokens, toc } = parseMdx("");
		expect(tokens).toHaveLength(1);
		expect(tokens[0].type).toBe("blank");
		expect(toc).toHaveLength(0);
	});

	it("handles string with only whitespace", () => {
		const { tokens } = parseMdx("   \n   \n   ");
		tokens.forEach((t) => expect(t.type).toBe("blank"));
	});

	it("handles heading with inline formatting", () => {
		const { tokens } = parseMdx("## Install `npm` package");
		const heading = tokens[0] as { children: { type: string }[] };
		expect(heading.children.some((n) => n.type === "code")).toBe(true);
	});

	it("handles unclosed code block gracefully", () => {
		expect(() => parseMdx("```ts\nconst x = 1;")).not.toThrow();
	});

	it("handles very long paragraph without crashing", () => {
		const longText = "word ".repeat(500);
		expect(() => parseMdx(longText)).not.toThrow();
	});
});
