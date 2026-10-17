import { toHtml } from "hast-util-to-html";
import { describe, expect, it } from "vitest";
import type { RepoResolver } from "./components";
import { type RenderOptions, renderMarkdown } from "./render.server";

const html = async (markdown: string, options?: RenderOptions) =>
	toHtml((await renderMarkdown(markdown, options)).tree);

describe("directives: text stays text", () => {
	it("doesn't turn colons in prose into components", async () => {
		const out = await html("Ratio 1:x at 10:30, key:value and a :smile:.");
		expect(out).toBe("<p>Ratio 1:x at 10:30, key:value and a :smile:.</p>");
	});

	it("gives unknown directives back as written", async () => {
		const out = await html("::unknown[x]{y=1}\n\n:::mystery\nKept.\n:::");
		expect(out).toBe("<p>::unknown[x]{y=1}</p><p>Kept.</p>");
	});

	it("treats a single dollar as money and $$…$$ as math", async () => {
		const out = await html("From $5 to $10, and $$a^2$$ inline.");
		expect(out).toContain("From $5 to $10");
		expect(out).toContain('<span class="katex">');
		expect(out).toContain(
			'<annotation encoding="application/x-tex">a^2</annotation>',
		);
	});

	it("renders display math as a block", async () => {
		const out = await html("$$\nv t + \\frac{v^2}{2a} \\le d\n$$");
		expect(out).toContain('<span class="katex-display">');
		expect(out).not.toContain("data-component");
	});
});

describe("directives: components", () => {
	it("makes titled callouts", async () => {
		const out = await html(
			":::warning[Battery safety]\nKeep it above **20 %**.\n:::",
		);
		expect(out).toBe(
			'<div data-component="callout" data-kind="warning" data-title="Battery safety"><p>Keep it above <strong>20 %</strong>.</p></div>',
		);
	});

	it("makes collapsible details, with a default summary", async () => {
		const out = await html(
			":::details[Launch file]\nHidden.\n:::\n\n:::details\nNo label.\n:::",
			{ detailsLabel: "Detail" },
		);
		expect(out).toContain(
			"<details><summary>Launch file</summary><p>Hidden.</p></details>",
		);
		expect(out).toContain(
			"<details><summary>Detail</summary><p>No label.</p></details>",
		);
	});

	it("numbers steps and keeps their headings out of the outline", async () => {
		const { tree, toc } = await renderMarkdown(
			"## Setup\n\n:::steps\n### Teach\nDrive.\n\n### Repeat\nFollow.\n:::",
		);
		expect(toHtml(tree)).toContain('<div class="md-steps"><h3 id="teach">');
		expect(toc).toEqual([{ id: "setup", text: "Setup", level: 2 }]);
	});

	it("builds tabs from :::tab blocks and from a code group", async () => {
		const out = await html(
			[
				"::::tabs",
				":::tab[Python]",
				"Py.",
				":::",
				":::tab[C++]",
				"Cpp.",
				":::",
				"::::",
				"",
				":::code-group",
				'```bash title="pnpm"',
				"pnpm add x",
				"```",
				"```bash",
				"npm i x",
				"```",
				":::",
			].join("\n"),
		);
		expect(out).toContain(
			'<div data-component="tabs" data-labels="[&#x22;Python&#x22;,&#x22;C++&#x22;]"><div data-component="tab" data-label="Python" data-index="0"><p>Py.</p></div><div data-component="tab" data-label="C++" data-index="1">',
		);
		// Untitled blocks are named by their language.
		expect(out).toContain('data-labels="[&#x22;pnpm&#x22;,&#x22;Shell&#x22;]"');
	});

	it("draws file trees: folders, files, notes and marked items", async () => {
		const out = await html(
			":::files\n- src/\n  - **page.tsx** the home page\n- package.json\n:::",
		);
		expect(out).toBe(
			'<div class="md-files"><ul><li class="md-dir"><span class="md-file-name">src</span><ul><li class="md-file md-marked"><span class="md-file-name">page.tsx</span><span class="md-file-note">the home page</span></li></ul></li><li class="md-file"><span class="md-file-name">package.json</span></li></ul></div>',
		);
	});

	it("lays out a gallery of zoomable figures", async () => {
		const out = await html(
			':::gallery{cols=3}\n![A](/a.png "First")\n![B](/b.png)\n:::',
		);
		expect(out).toMatch(
			/^<div class="md-gallery" data-cols="3"><figure data-zoom=""/,
		);
		expect(out.match(/<figure data-zoom/g)).toHaveLength(2);
		expect(out).toContain("<figcaption>First</figcaption>");
	});

	it("embeds videos from YouTube or a file, and refuses unsafe sources", async () => {
		const out = await html(
			[
				'::youtube[Talk]{id="https://youtu.be/dQw4w9WgXcQ"}',
				'::video[Patrol]{src="/videos/p.mp4" poster="/images/p.jpg"}',
				'::video{src="javascript:alert(1)"}',
			].join("\n\n"),
		);
		expect(out).toContain(
			'<div data-component="youtube" data-id="dQw4w9WgXcQ" data-title="Talk"></div>',
		);
		expect(out).toContain(
			'<video src="/videos/p.mp4" poster="/images/p.jpg" controls',
		);
		expect(out).toContain('<p>::video{src="javascript:alert(1)"}</p>');
	});
});

describe("directives: repo cards", () => {
	const resolve: RepoResolver = async (name) =>
		name === "me/private"
			? "missing"
			: name === "me/down"
				? "unknown"
				: {
						url: `https://github.com/${name}`,
						description: "Gestures",
						language: "Python",
						stars: 12,
						forks: 0,
					};

	it("fills a card from GitHub, links when GitHub is down, hides private repos", async () => {
		const out = await html(
			'::github{repo="me/ur5"}\n\n::github{repo="me/down"}\n\n::github{repo="me/private"}',
			{ resolveRepo: resolve },
		);
		expect(out).toContain(
			'<div data-component="repo" data-repo="me/ur5" data-url="https://github.com/me/ur5" data-description="Gestures" data-language="Python" data-stars="12" data-forks="0"></div>',
		);
		expect(out).toContain(
			'<div data-component="repo" data-repo="me/down" data-url="https://github.com/me/down"></div>',
		);
		expect(out).not.toContain("me/private");
	});
});

describe("directives: safety", () => {
	it("doesn't let raw HTML pose as a component", async () => {
		const out = await html(
			'<div data-component="youtube" data-id="dQw4w9WgXcQ" data-nonce="guess">x</div>',
		);
		expect(out).toBe("<div>x</div>");
	});

	it("sanitizes what goes inside a component", async () => {
		const out = await html(
			":::note\n<img src=x onerror=alert(1)><script>x</script>\n:::",
		);
		expect(out).not.toMatch(/onerror|script/);
	});
});

describe("code notations", () => {
	it("marks diffs, highlighted lines and words, and drops the comments", async () => {
		const out = await html(
			[
				"```ts /useState/",
				"const [a] = useState(0) // [!code highlight]",
				"old() // [!code --]",
				"next() // [!code ++]",
				"```",
			].join("\n"),
		);
		expect(out).toContain('class="line highlighted"');
		expect(out).toContain('class="line diff remove"');
		expect(out).toContain('class="line diff add"');
		expect(out).toContain('class="highlighted-word">useState</span>');
		expect(out).not.toContain("[!code");
	});

	it("doesn't read a title's slashes as a word to highlight", async () => {
		const out = await html(
			'```ts title="src/app/page.tsx"\nconst app = 1\n```',
		);
		expect(out).not.toContain("highlighted-word");
		expect(out).toContain('data-title="src/app/page.tsx"');
	});
});
