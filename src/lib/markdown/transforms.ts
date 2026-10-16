import GithubSlugger from "github-slugger";
import type { Element, ElementContent, Root } from "hast";
import { toString as textOf } from "hast-util-to-string";
import { SKIP, visit } from "unist-util-visit";
import type { CalloutKind, TocEntry } from "./types";

/**
 * Tree transforms that run after sanitizing, so everything they add is
 * trusted: heading anchors, callouts, video embeds, figures, table wrappers
 * and external link attributes. Each one is a small pure function over hast.
 */

const isElement = (node: unknown, tag?: string): node is Element =>
	typeof node === "object" &&
	node !== null &&
	(node as Element).type === "element" &&
	(tag === undefined || (node as Element).tagName === tag);

/** Children that render as something: drops whitespace between tags. */
const meaningful = (children: ElementContent[]) =>
	children.filter((c) => !(c.type === "text" && c.value.trim() === ""));

const element = (
	tagName: string,
	properties: Element["properties"],
	children: ElementContent[] = [],
): Element => ({ type: "element", tagName, properties, children });

// ── Headings ─────────────────────────────────────────────────────────────────

const LEVEL: Record<string, number> = {
	h1: 1,
	h2: 2,
	h3: 3,
	h4: 4,
	h5: 5,
	h6: 6,
};

const RESERVED_IDS = ["content"];

/**
 * Gives every heading a unique GitHub-style id, links it to itself and
 * returns the h2/h3 outline. The page already renders the title as the only
 * h1, so a body that uses `#` headings is shifted down one level.
 */
export function headings(tree: Root): TocEntry[] {
	let shift = 0;
	visit(tree, "element", (node) => {
		if (node.tagName === "h1") shift = 1;
	});

	const slugger = new GithubSlugger();
	// The page's own ids: a "Content" heading must not steal the skip link.
	for (const id of RESERVED_IDS) slugger.slug(id);
	const toc: TocEntry[] = [];
	visit(tree, "element", (node) => {
		// GFM's footnote label is a visually hidden h2; it isn't a section.
		if (node.tagName === "section" && "dataFootnotes" in node.properties)
			return SKIP;
		const depth = LEVEL[node.tagName];
		if (!depth) return;

		const level = Math.min(6, depth + shift);
		const text = textOf(node).replace(/\s+/g, " ").trim();
		const id = slugger.slug(text) || slugger.slug("section");
		node.tagName = `h${level}`;
		node.properties = { ...node.properties, id };
		if (level === 2 || level === 3) toc.push({ id, text, level });

		let linked = false;
		visit(node, "element", (child) => {
			if (child.tagName === "a") linked = true;
		});
		// A link can't contain another link: keep linked headings as they are.
		if (!linked) {
			node.children = [
				element("a", { href: `#${id}`, className: ["md-anchor"] }, [
					...node.children,
				]),
			];
		}
		return SKIP;
	});
	return toc;
}

// ── Callouts ─────────────────────────────────────────────────────────────────

const CALLOUT = /^\[!(note|tip|important|warning|caution)\][ \t]*(?:\r?\n|$)/i;

/** GitHub alerts: `> [!NOTE]` on the first line of a blockquote. */
export function callouts(tree: Root) {
	visit(tree, "element", (node, index, parent) => {
		if (node.tagName !== "blockquote" || !parent || index === undefined) return;
		const first = meaningful(node.children)[0];
		if (!isElement(first, "p")) return;
		const lead = first.children[0];
		if (lead?.type !== "text") return;
		const match = lead.value.match(CALLOUT);
		if (!match) return;

		lead.value = lead.value.slice(match[0].length);
		if (meaningful(first.children).length === 0) {
			node.children = node.children.filter((c) => c !== first);
		}
		parent.children[index] = element(
			"div",
			{
				dataComponent: "callout",
				dataKind: match[1].toLowerCase() as CalloutKind,
			},
			node.children,
		);
	});
}

// ── Paragraphs that are really media ─────────────────────────────────────────

const YOUTUBE =
	/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;
const VIDEO_ID = /^[\w-]{11}$/;

export function youtubeId(url: string): string | null {
	const match = url.match(YOUTUBE);
	if (match) return match[1];
	return VIDEO_ID.test(url) ? url : null;
}

const prop = (node: Element, name: string) => {
	const value = node.properties[name];
	return typeof value === "string" ? value : undefined;
};

/** The image of a paragraph that holds only an image (or a linked image). */
function soleImage(p: Element): Element | null {
	const [only, ...rest] = meaningful(p.children);
	if (rest.length > 0 || !isElement(only)) return null;
	if (only.tagName === "img") return only;
	if (only.tagName !== "a") return null;
	const [inner, ...more] = meaningful(only.children);
	return more.length === 0 && isElement(inner, "img") ? inner : null;
}

function videoOf(p: Element): { id: string; title?: string } | null {
	const kids = meaningful(p.children);

	// ::youtube[Title](id or URL)
	const [marker, link, ...rest] = kids;
	if (
		rest.length === 0 &&
		marker?.type === "text" &&
		marker.value.trim() === "::youtube" &&
		isElement(link, "a")
	) {
		const id = youtubeId(prop(link, "href") ?? "");
		return id ? { id, title: textOf(link).trim() || undefined } : null;
	}

	// ![Title](https://youtu.be/id), or a thumbnail linked to the video.
	const image = soleImage(p);
	if (!image) return null;
	const [only] = kids;
	const target =
		isElement(only, "a") && prop(only, "href")
			? prop(only, "href")
			: prop(image, "src");
	const id = target && YOUTUBE.test(target) ? youtubeId(target) : null;
	const title = prop(image, "alt") || prop(image, "title");
	return id ? { id, title: title || undefined } : null;
}

/**
 * A paragraph that only holds an image becomes a figure (its title is the
 * caption); one that only holds a YouTube link becomes a click-to-load embed.
 */
export function media(tree: Root) {
	visit(tree, "element", (node, index, parent) => {
		if (node.tagName !== "p" || !parent || index === undefined) return;
		// `<p align="center">` from a README is layout: leave it alone.
		if (Object.keys(node.properties).length > 0) return;

		const video = videoOf(node);
		if (video) {
			parent.children[index] = element("div", {
				dataComponent: "youtube",
				dataId: video.id,
				dataTitle: video.title,
			});
			return SKIP;
		}

		const image = soleImage(node);
		if (!image) return;
		const caption = prop(image, "title");
		parent.children[index] = element("figure", {}, [
			...meaningful(node.children),
			...(caption
				? [element("figcaption", {}, [{ type: "text", value: caption }])]
				: []),
		]);
		return SKIP;
	});
}

// ── Footnotes, tables, images, links ─────────────────────────────────────────

/**
 * Sanitizing prefixes every id with `user-content-` against DOM clobbering;
 * point GFM's footnote links at the prefixed ids.
 */
export function footnotes(tree: Root, prefix = "user-content-") {
	visit(tree, "element", (node) => {
		if (node.tagName !== "a") return;
		const { dataFootnoteRef, dataFootnoteBackref } = node.properties;
		if (dataFootnoteRef === undefined && dataFootnoteBackref === undefined)
			return;
		const href = prop(node, "href");
		if (href?.startsWith("#") && !href.startsWith(`#${prefix}`)) {
			node.properties.href = `#${prefix}${href.slice(1)}`;
		}
	});
}

/** Wide tables scroll inside their own box instead of the page. */
export function tables(tree: Root) {
	visit(tree, "element", (node, index, parent) => {
		if (node.tagName !== "table" || !parent || index === undefined) return;
		parent.children[index] = element(
			"div",
			{ className: ["md-table"], tabIndex: 0 },
			[node],
		);
		return SKIP;
	});
}

/** Images load lazily; links that leave the site open in a new tab. */
export function attributes(tree: Root, siteUrl: string) {
	const host = new URL(siteUrl).host.replace(/^www\./, "");
	visit(tree, "element", (node) => {
		if (node.tagName === "img") {
			node.properties.loading = "lazy";
			node.properties.decoding = "async";
			return;
		}
		if (node.tagName !== "a") return;
		const href = prop(node, "href");
		if (!href || !/^https?:\/\//i.test(href)) return;
		let external = true;
		try {
			external = new URL(href).host.replace(/^www\./, "") !== host;
		} catch {
			// Not a URL the browser would follow anyway; treat as external.
		}
		if (external) {
			node.properties.target = "_blank";
			node.properties.rel = ["noopener", "noreferrer"];
		}
	});
}

/**
 * Positions, parser data and the newlines between top-level blocks are dead
 * weight once the tree is final (and would all be sent to the browser).
 */
export function compact(tree: Root) {
	tree.children = tree.children.filter(
		(node) => !(node.type === "text" && node.value.trim() === ""),
	);
	visit(tree, (node) => {
		delete node.position;
		delete node.data;
	});
}
