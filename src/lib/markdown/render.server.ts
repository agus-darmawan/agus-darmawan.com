import "server-only";
import type { Element, Root } from "hast";
import { toString as textOf } from "hast-util-to-string";
import type { Root as MdastRoot } from "mdast";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, {
	defaultSchema,
	type Options as Schema,
} from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";
import { SITE } from "@/config/site";
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
 *   remark (GFM)  →  rehype, raw HTML parsed  →  sanitized (GitHub's rules)
 *   →  trusted passes: Shiki, heading anchors, callouts, embeds, figures
 *
 * Bodies come from our own MDX files and from GitHub READMEs, so raw HTML is
 * allowed (READMEs are full of it) but always sanitized before anything we
 * add, which is why our own markup (Shiki styles, components) survives.
 */

const schema: Schema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		// The fence info after the language, read by the highlighter.
		code: [...(defaultSchema.attributes?.code ?? []), "dataMeta"],
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
}

export async function renderMarkdown(
	markdown: string,
	{ footnoteLabel, footnoteBackLabel }: RenderOptions = {},
): Promise<MarkdownDoc> {
	const processor = unified()
		.use(remarkParse)
		// `~250 lines` is not strikethrough; `~~text~~` still is.
		.use(remarkGfm, { singleTilde: false })
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
		.use(rehypeCode);

	const tree = await processor.run(processor.parse(markdown));
	const toc = headings(tree);
	footnotes(tree);
	callouts(tree);
	media(tree);
	tables(tree);
	attributes(tree, SITE.url);
	compact(tree);
	return { tree, toc };
}
