import "server-only";
import { randomUUID } from "node:crypto";
import type { Element, Root } from "hast";
import { toString as textOf } from "hast-util-to-string";
import type { Root as MdastRoot } from "mdast";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, {
	defaultSchema,
	type Options as Schema,
} from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";
import { SITE } from "@/config/site";
import {
	components,
	type RepoResolver,
	repos,
	trustComponents,
} from "./components";
import { COMPONENT_PROPS, remarkComponents } from "./directives";
import { highlight, languageLabel, parseCodeMeta } from "./highlight.server";
import {
	attributes,
	callouts,
	compact,
	footnotes,
	headings,
	media,
	tables,
} from "./transforms";
import type { MarkdownDoc } from "./types";

/**
 * Markdown → a sanitized, highlighted hast tree plus its outline.
 *
 *   remark (GFM, $$math$$, directives)  →  rehype, raw HTML parsed
 *   →  sanitized (GitHub's rules)  →  trusted passes: components, KaTeX,
 *   Shiki, heading anchors, callouts, embeds, figures, repo cards
 *
 * Bodies come from our own MDX files and from GitHub READMEs, so raw HTML is
 * allowed (READMEs are full of it) but always sanitized before anything we
 * add, which is why our own markup (Shiki styles, components) survives.
 */

const schema: Schema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		// Language and math classes, and the fence info for the highlighter.
		code: [
			["className", /^language-./, "math-inline", "math-display"],
			"dataMeta",
		],
		// Directive markers; `trustComponents` drops forged ones.
		div: [...(defaultSchema.attributes?.div ?? []), ...COMPONENT_PROPS],
	},
};

/** Keeps the fence info string (`title="a.ts" {2}`) through to hast. */
function remarkCodeMeta() {
	return (tree: MdastRoot) => {
		visit(tree, "code", (node) => {
			if (!node.meta) return;
			node.data = {
				...node.data,
				hProperties: { ...node.data?.hProperties, dataMeta: node.meta },
			};
		});
	};
}

const languageOf = (code: Element) => {
	const classes = code.properties.className;
	const name = (Array.isArray(classes) ? classes : [])
		.map(String)
		.find((c) => c.startsWith("language-"));
	return name?.slice("language-".length) ?? "";
};

/** Replaces every `<pre><code>` with a highlighted code block component. */
function rehypeCode() {
	return async (tree: Root) => {
		const jobs: Promise<void>[] = [];
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "pre" || !parent || index === undefined) return;
			const code = node.children.find(
				(c): c is Element => c.type === "element" && c.tagName === "code",
			);
			if (!code) return SKIP;
			const lang = languageOf(code);
			const info = code.properties.dataMeta;
			const meta = parseCodeMeta(typeof info === "string" ? info : undefined);
			jobs.push(
				highlight(textOf(code), lang, meta).then(({ pre }) => {
					parent.children[index] = {
						type: "element",
						tagName: "div",
						properties: {
							dataComponent: "code",
							dataLang: languageLabel(lang),
							dataTitle: meta.title,
						},
						children: [pre],
					};
				}),
			);
			return SKIP;
		});
		await Promise.all(jobs);
	};
}

export interface RenderOptions {
	/** Visually hidden heading of the footnotes section. */
	footnoteLabel?: string;
	/** Accessible name of a footnote's way back, given its number. */
	footnoteBackLabel?: (reference: string) => string;
	/** Summary of a `:::details` written without one. */
	detailsLabel?: string;
	/** Looks up `::github` repos; without it, cards are plain links. */
	resolveRepo?: RepoResolver;
}

export async function renderMarkdown(
	markdown: string,
	{
		footnoteLabel,
		footnoteBackLabel,
		detailsLabel = "Details",
		resolveRepo,
	}: RenderOptions = {},
): Promise<MarkdownDoc> {
	// Marks this render's components; raw HTML can't guess it.
	const nonce = randomUUID();
	const processor = unified()
		.use(remarkParse)
		// `~250 lines` is not strikethrough; `~~text~~` still is.
		.use(remarkGfm, { singleTilde: false })
		// Math is `$$…$$` only: a single `$` is a price.
		.use(remarkMath, { singleDollarTextMath: false })
		.use(remarkDirective)
		.use(remarkComponents, { nonce, source: markdown, detailsLabel })
		.use(remarkCodeMeta)
		.use(remarkRehype, {
			allowDangerousHtml: true,
			// Sanitizing adds the prefix; `footnotes()` then fixes the links.
			clobberPrefix: "",
			footnoteLabel,
			footnoteBackLabel: footnoteBackLabel
				? (index, again) =>
						footnoteBackLabel(`${index + 1}${again > 1 ? `-${again}` : ""}`)
				: undefined,
		})
		.use(rehypeRaw)
		.use(rehypeSanitize, schema)
		.use(() => (tree: Root) => trustComponents(tree, nonce))
		// Before Shiki, which would take display math for a code block.
		.use(rehypeKatex)
		.use(rehypeCode);

	const tree = await processor.run(processor.parse(markdown));
	const toc = headings(tree);
	footnotes(tree);
	callouts(tree);
	components(tree);
	media(tree);
	await repos(tree, resolveRepo);
	tables(tree);
	attributes(tree, SITE.url);
	compact(tree);
	return { tree, toc };
}
