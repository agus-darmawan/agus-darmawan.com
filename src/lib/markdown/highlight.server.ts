import "server-only";
import {
	transformerMetaWordHighlight,
	transformerNotationDiff,
	transformerNotationFocus,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import type { Element, ElementContent } from "hast";
import {
	createHighlighterCore,
	type HighlighterCore,
	type ShikiTransformer,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/**
 * Server-side syntax highlighting with Shiki (VS Code grammars).
 *
 * Runs at build/revalidation time only, so no grammar ever reaches the
 * browser. Both themes are emitted as CSS variables (`--shiki-light`,
 * `--shiki-dark`) and the stylesheet picks one, so code follows the site's
 * light/dark switch without re-rendering.
 */

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
	highlighter ??= createHighlighterCore({
		themes: [
			import("shiki/themes/github-light.mjs"),
			import("shiki/themes/github-dark.mjs"),
		],
		langs: [
			import("shiki/langs/bash.mjs"),
			import("shiki/langs/c.mjs"),
			import("shiki/langs/cmake.mjs"),
			import("shiki/langs/cpp.mjs"),
			import("shiki/langs/css.mjs"),
			import("shiki/langs/dart.mjs"),
			import("shiki/langs/diff.mjs"),
			import("shiki/langs/dockerfile.mjs"),
			import("shiki/langs/go.mjs"),
			import("shiki/langs/html.mjs"),
			import("shiki/langs/ini.mjs"),
			import("shiki/langs/javascript.mjs"),
			import("shiki/langs/json.mjs"),
			import("shiki/langs/jsx.mjs"),
			import("shiki/langs/kotlin.mjs"),
			import("shiki/langs/markdown.mjs"),
			import("shiki/langs/python.mjs"),
			import("shiki/langs/rust.mjs"),
			import("shiki/langs/sql.mjs"),
			import("shiki/langs/toml.mjs"),
			import("shiki/langs/tsx.mjs"),
			import("shiki/langs/typescript.mjs"),
			import("shiki/langs/xml.mjs"),
			import("shiki/langs/yaml.mjs"),
		],
		// Pure JS: no WASM to bundle into the serverless functions.
		engine: createJavaScriptRegexEngine({ forgiving: true }),
	});
	return highlighter;
}

/** Names people write after ``` that the grammars don't alias themselves. */
const ALIASES: Record<string, string> = {
	console: "bash",
	shell: "bash",
	sh: "bash",
	zsh: "bash",
	"c++": "cpp",
	cc: "cpp",
	h: "cpp",
	hpp: "cpp",
	launch: "xml",
	urdf: "xml",
	mdx: "markdown",
	yml: "yaml",
};

const LABELS: Record<string, string> = {
	bash: "Shell",
	c: "C",
	cmake: "CMake",
	cpp: "C++",
	css: "CSS",
	dart: "Dart",
	diff: "Diff",
	dockerfile: "Dockerfile",
	go: "Go",
	html: "HTML",
	ini: "INI",
	javascript: "JavaScript",
	js: "JavaScript",
	json: "JSON",
	jsx: "JSX",
	kotlin: "Kotlin",
	markdown: "Markdown",
	md: "Markdown",
	py: "Python",
	python: "Python",
	rust: "Rust",
	sql: "SQL",
	toml: "TOML",
	ts: "TypeScript",
	tsx: "TSX",
	typescript: "TypeScript",
	xml: "XML",
	yaml: "YAML",
};

const PLAIN = new Set(["", "text", "txt", "plain", "plaintext"]);

/** What the code block's header calls the language; none for plain text. */
export function languageLabel(requested: string): string | undefined {
	const wanted = requested.toLowerCase();
	if (PLAIN.has(wanted)) return undefined;
	return LABELS[ALIASES[wanted] ?? wanted] ?? requested;
}

export interface CodeMeta {
	title?: string;
	/** 1-based line numbers to emphasize, from `{1,3-5}`. */
	highlight: Set<number>;
	lineNumbers: boolean;
	/** The rest of the info string, for Shiki (`/word/` highlights). */
	rest: string;
}

const TITLE = /title=(?:"([^"]*)"|'([^']*)')/;

/**
 * Parses the info string after the language:
 * `title="a.ts" {1,3-5} showLineNumbers /useState/`.
 */
export function parseCodeMeta(meta: string | undefined): CodeMeta {
	const text = meta ?? "";
	const title = text.match(TITLE);
	const highlight = new Set<number>();
	for (const range of text.match(/\{([\d,\s-]+)\}/)?.[1].split(",") ?? []) {
		const [from, to = from] = range.trim().split("-").map(Number);
		if (!Number.isInteger(from) || !Number.isInteger(to)) continue;
		for (let n = from; n <= Math.min(to, from + 500); n++) highlight.add(n);
	}
	return {
		title: title?.[1] ?? title?.[2] ?? undefined,
		highlight,
		lineNumbers: /\bshowLineNumbers\b/.test(text),
		// A title is a path: its slashes must not read as `/word/` patterns.
		rest: text.replace(TITLE, "").trim(),
	};
}

/**
 * Comment notations in the code itself (the comment is removed):
 * `// [!code ++]` and `// [!code --]` mark a diff, `// [!code highlight]`
 * a line, `// [!code focus]` dims the rest, `// [!code word:name]` a word.
 */
const NOTATIONS = [
	transformerNotationDiff(),
	transformerNotationHighlight(),
	transformerNotationFocus(),
	transformerNotationWordHighlight(),
	transformerMetaWordHighlight(),
];

export interface HighlightedCode {
	/** The `<pre>` Shiki produced, ready to drop into a hast tree. */
	pre: Element;
	/** The language actually used (`text` when we have no grammar for it). */
	lang: string;
}

export async function highlight(
	code: string,
	requested: string,
	meta: CodeMeta,
): Promise<HighlightedCode> {
	const shiki = await getHighlighter();
	const wanted = requested.toLowerCase();
	const name = ALIASES[wanted] ?? wanted;
	const lang = shiki.getLoadedLanguages().includes(name) ? name : "text";

	const lines: ShikiTransformer = {
		code(node) {
			// Lines are block-level in CSS; the "\n" text nodes between them
			// would render as empty rows.
			node.children = node.children.filter(
				(child: ElementContent) => child.type === "element",
			);
			if (meta.lineNumbers) node.properties["data-line-numbers"] = "";
		},
		line(node, line) {
			if (meta.highlight.has(line)) this.addClassToHast(node, "highlighted");
		},
	};

	const root = shiki.codeToHast(code.replace(/\n$/, ""), {
		lang,
		meta: { __raw: meta.rest },
		themes: { light: "github-light", dark: "github-dark" },
		defaultColor: false,
		// Ours last: it drops the newlines the notations still expect.
		transformers: [...NOTATIONS, lines],
	});
	const pre = root.children.find(
		(child): child is Element =>
			child.type === "element" && child.tagName === "pre",
	);
	if (!pre) throw new Error("Shiki returned no <pre>");
	// Backgrounds come from the site's tokens, not the themes. The tabindex
	// stays: it lets keyboard users scroll long lines.
	delete pre.properties.style;
	return { pre, lang };
}
