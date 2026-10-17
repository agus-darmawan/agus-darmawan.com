import { toHtml } from "hast-util-to-html";
import { describe, expect, it } from "vitest";
import { parseCodeMeta } from "./highlight.server";
import { renderMarkdown } from "./render.server";
import { youtubeId } from "./transforms";

const html = async (markdown: string) =>
	toHtml((await renderMarkdown(markdown)).tree);

describe("renderMarkdown: CommonMark and GFM", () => {
	it("joins soft-wrapped lines into one paragraph", async () => {
		expect(await html("one\ntwo")).toBe("<p>one\ntwo</p>");
	});

	it("keeps snake_case identifiers and a single tilde as text", async () => {
		const out = await html("use_sim_time is ~250 lines, ~~gone~~");
		expect(out).toBe("<p>use_sim_time is ~250 lines, <del>gone</del></p>");
	});

	it("nests lists and keeps several paragraphs in one item", async () => {
		const out = await html("- a\n  - b\n\n  more about a\n- c");
		expect(out).toContain("<li>\n<p>a</p>\n<ul>\n<li>b</li>\n</ul>");
		expect(out).toContain("<p>more about a</p>");
	});

	it("wraps tables in a scroll box and keeps column alignment", async () => {
		const out = await html("| a | b |\n|---|:-:|\n| 1 | 2 |");
		expect(out).toMatch(/^<div class="md-table" tabindex="0"><table>/);
		expect(out).toContain('<td align="center">2</td>');
	});

	it("renders task lists as disabled checkboxes", async () => {
		const out = await html("- [x] done\n- [ ] todo");
		expect(out).toContain('<input type="checkbox" checked disabled> done');
		expect(out).toContain('<input type="checkbox" disabled> todo');
	});

	it("links footnotes to the ids that survive sanitizing", async () => {
		const { tree } = await renderMarkdown("Text[^1].\n\n[^1]: Note.", {
			footnoteLabel: "Catatan kaki",
			footnoteBackLabel: (n) => `Kembali ke ${n}`,
		});
		const out = toHtml(tree);
		expect(out).toContain(
			'href="#user-content-fn-1" id="user-content-fnref-1"',
		);
		expect(out).toContain('<li id="user-content-fn-1">');
		expect(out).toContain('href="#user-content-fnref-1"');
		expect(out).toContain('aria-label="Kembali ke 1"');
		expect(out).toContain(">Catatan kaki</h2>");
	});
});

describe("renderMarkdown: headings and outline", () => {
	it("gives headings unique ids, self-links and an h2/h3 outline", async () => {
		const { tree, toc } = await renderMarkdown(
			"## Setup\n\n### Install\n\n#### Details\n\n## Setup",
		);
		expect(toHtml(tree)).toContain(
			'<h2 id="setup"><a href="#setup" class="md-anchor">Setup</a></h2>',
		);
		expect(toc).toEqual([
			{ id: "setup", text: "Setup", level: 2 },
			{ id: "install", text: "Install", level: 3 },
			{ id: "setup-1", text: "Setup", level: 2 },
		]);
	});

	it("shifts a body that uses # headings below the page's h1", async () => {
		const { tree, toc } = await renderMarkdown("# Usage\n\n## Flags");
		expect(toHtml(tree)).toMatch(/^<h2 id="usage">.*<\/h2><h3 id="flags">/);
		expect(toc.map((e) => e.level)).toEqual([2, 3]);
	});

	it("never produces empty ids or the page's own ids", async () => {
		const { toc } = await renderMarkdown(
			"## 🚀\n\n## Content\n\n## 2. Install",
		);
		expect(toc.map((e) => e.id)).toEqual(["section", "content-1", "2-install"]);
	});

	it("keeps formatting in the heading but plain text in the outline", async () => {
		const { tree, toc } = await renderMarkdown("## The `cmd_vel` topic");
		expect(toHtml(tree)).toContain("<code>cmd_vel</code>");
		expect(toc[0].text).toBe("The cmd_vel topic");
	});

	it("does not nest a link inside a heading that already has one", async () => {
		const out = await html("## [Docs](https://example.com)");
		expect(out).not.toContain("md-anchor");
		expect(out).toMatch(/^<h2 id="docs"><a href="https:\/\/example.com"/);
	});

	it("leaves the footnote label out of the outline", async () => {
		const { toc } = await renderMarkdown("## One\n\nText[^a].\n\n[^a]: Note.");
		expect(toc).toEqual([{ id: "one", text: "One", level: 2 }]);
	});
});

describe("renderMarkdown: code", () => {
	it("highlights with both themes as CSS variables", async () => {
		const out = await html("```ts\nconst a = 1;\n```");
		expect(out).toContain('data-component="code" data-lang="TypeScript"');
		expect(out).toContain(
			'<pre class="shiki shiki-themes github-light github-dark" tabindex="0">',
		);
		expect(out).toContain(
			'<span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span>',
		);
		// The page's tokens paint the background, not the theme.
		expect(out).not.toContain("--shiki-light-bg");
	});

	it("reads the title, highlighted lines and line numbers from the fence", async () => {
		const out = await html(
			'```ts title="store.ts" {1,3} showLineNumbers\na\nb\nc\n```',
		);
		expect(out).toContain('data-title="store.ts"');
		expect(out).toContain('<code data-line-numbers="">');
		expect(out.match(/class="line highlighted"/g)).toHaveLength(2);
	});

	it("emits one block element per line and no stray newlines", async () => {
		const out = await html("```bash\nls\npwd\n```");
		expect(out).toMatch(/<\/span><span class="line">/);
		expect(out).not.toMatch(/<\/span>\n<span class="line">/);
	});

	it("falls back to plain text but keeps the language name", async () => {
		const out = await html("```mermaid\ngraph LR\n```");
		expect(out).toContain('data-lang="mermaid"');
		expect(out).toContain("<span>graph LR</span>");
	});

	it("shows no language name for plain text", async () => {
		expect(await html("```text\nA ---> B\n```")).not.toContain("data-lang");
	});

	it("maps common aliases to a grammar", async () => {
		const out = await html("```sh\necho hi\n```\n\n```c++\nint x;\n```");
		expect(out).toContain('data-lang="Shell"');
		expect(out).toContain('data-lang="C++"');
		expect(out.match(/--shiki-light:#/g)?.length).toBeGreaterThan(2);
	});

	it("parses fence meta", () => {
		expect(
			parseCodeMeta(`title='src/a b.ts' {2, 4-6} showLineNumbers /x/`),
		).toEqual({
			title: "src/a b.ts",
			highlight: new Set([2, 4, 5, 6]),
			lineNumbers: true,
			rest: "{2, 4-6} showLineNumbers /x/",
		});
		expect(parseCodeMeta(undefined)).toEqual({
			title: undefined,
			highlight: new Set(),
			lineNumbers: false,
			rest: "",
		});
	});
});

describe("renderMarkdown: callouts and media", () => {
	it("turns GitHub alerts into callouts and leaves other quotes alone", async () => {
		const out = await html("> [!WARNING]\n> Careful.\n\n> Just a quote.");
		expect(out).toContain(
			'<div data-component="callout" data-kind="warning">\n<p>Careful.</p>\n</div>',
		);
		expect(out).toContain("<blockquote>\n<p>Just a quote.</p>\n</blockquote>");
	});

	it("drops the marker line when the alert text starts below it", async () => {
		const out = await html("> [!TIP]\n>\n> Use the handheld.");
		expect(out).toBe(
			'<div data-component="callout" data-kind="tip">\n\n<p>Use the handheld.</p>\n</div>',
		);
	});

	it("embeds YouTube from an image link, a shortcode or a linked thumbnail", async () => {
		const out = await html(
			[
				"![Demo](https://youtu.be/dQw4w9WgXcQ)",
				"::youtube[Talk](dQw4w9WgXcQ)",
				"[![Thumb](https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
			].join("\n\n"),
		);
		expect(
			out.match(/data-component="youtube" data-id="dQw4w9WgXcQ"/g),
		).toHaveLength(3);
		expect(out).toContain('data-title="Talk"');
	});

	it("extracts video ids from every URL shape", () => {
		for (const url of [
			"https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10",
			"https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ",
			"https://youtu.be/dQw4w9WgXcQ",
			"https://www.youtube.com/shorts/dQw4w9WgXcQ",
			"https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
			"dQw4w9WgXcQ",
		]) {
			expect(youtubeId(url)).toBe("dQw4w9WgXcQ");
		}
		expect(youtubeId("https://example.com/watch?v=nope")).toBeNull();
	});

	it("makes a lone image a zoomable figure, captioned by its title", async () => {
		const out = await html('![Arch](/a.png "The architecture")');
		expect(out).toBe(
			'<figure data-zoom="" data-src="/a.png" data-alt="Arch"><img src="/a.png" alt="Arch" title="The architecture" loading="lazy" decoding="async"><figcaption>The architecture</figcaption></figure>',
		);
	});

	it("keeps a linked image's link instead of zooming it", async () => {
		const out = await html("[![Shot](/a.png)](https://example.com)");
		expect(out).toMatch(/^<figure><a href="https:\/\/example.com"/);
	});

	it("leaves images inside text, and README layout paragraphs, as they are", async () => {
		expect(await html("Badge ![CI](/b.svg) here")).toMatch(/^<p>Badge <img/);
		expect(
			await html('<p align="center"><img src="logo.png" width="120"></p>'),
		).toBe(
			'<p align="center"><img src="logo.png" width="120" loading="lazy" decoding="async"></p>',
		);
	});
});

describe("renderMarkdown: safety", () => {
	it("removes scripts, event handlers, styles and javascript: links", async () => {
		const out = await html(
			[
				"<script>alert(1)</script>",
				'<img src="x.png" onerror="alert(1)" style="position:fixed">',
				"[bad](javascript:alert(1))",
				'<a href="#" onclick="steal()">x</a>',
				'<iframe src="https://evil.example"></iframe>',
			].join("\n\n"),
		);
		expect(out).not.toMatch(/script|onerror|onclick|style=|javascript:|iframe/);
		expect(out).toContain('<img src="x.png"');
	});

	it("prefixes ids from raw HTML so they can't clobber globals", async () => {
		expect(await html('<div id="__next">x</div>')).toContain(
			'id="user-content-__next"',
		);
	});

	it("opens external links in a new tab, but not links to this site", async () => {
		const out = await html(
			"[gh](https://github.com/x) [here](https://www.agus-darmawan.com/en/blog) [top](#setup)",
		);
		expect(out).toContain(
			'<a href="https://github.com/x" target="_blank" rel="noopener noreferrer">gh</a>',
		);
		expect(out).toContain(
			'<a href="https://www.agus-darmawan.com/en/blog">here</a>',
		);
		expect(out).toContain('<a href="#setup">top</a>');
	});

	it("returns plain JSON without parser positions", async () => {
		const doc = await renderMarkdown("## Hi\n\n```ts\nx\n```");
		const json = JSON.stringify(doc);
		expect(json).not.toContain('"position"');
		expect(JSON.parse(json)).toEqual(doc);
	});

	it("handles empty and whitespace-only bodies", async () => {
		expect(await renderMarkdown("")).toEqual({
			tree: { type: "root", children: [] },
			toc: [],
		});
		expect((await renderMarkdown("  \n\n ")).toc).toEqual([]);
	});
});
