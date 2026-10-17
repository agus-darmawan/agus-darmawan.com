import type { Element, ElementContent, Root, Text } from "hast";
import { toString as textOf } from "hast-util-to-string";
import { SKIP, visit } from "unist-util-visit";
import { COMPONENT_PROPS } from "./directives";
import { zoomable } from "./transforms";

/**
 * The second half of the directive components (see `directives.ts`), on the
 * sanitized tree: check the markers, then turn the simple ones into plain
 * markup (steps, file trees, galleries, videos) and look up repo cards.
 */

const isElement = (node: unknown, tag?: string): node is Element =>
	typeof node === "object" &&
	node !== null &&
	(node as Element).type === "element" &&
	(tag === undefined || (node as Element).tagName === tag);

const text = (value: string): Text => ({ type: "text", value });

const element = (
	tagName: string,
	properties: Element["properties"],
	children: ElementContent[] = [],
): Element => ({ type: "element", tagName, properties, children });

const prop = (node: Element, name: string) => {
	const value = node.properties[name];
	return typeof value === "string" ? value : undefined;
};

/**
 * Keeps component markers that carry this render's nonce and strips every
 * other one: those came from raw HTML, not from a directive.
 */
export function trustComponents(tree: Root, nonce: string) {
	visit(tree, "element", (node) => {
		const props = node.properties;
		if (props.dataNonce === nonce) {
			delete props.dataNonce;
			return;
		}
		for (const key of COMPONENT_PROPS) delete props[key];
	});
}

// ── File trees ───────────────────────────────────────────────────────────────

/**
 * `- src/` items become folders (so does anything with a nested list), the
 * rest files; text after the name is a note, and **bold** marks an item.
 */
function fileList(list: Element): Element {
	const items = list.children.filter((c): c is Element => isElement(c, "li"));
	return element(
		"ul",
		{},
		items.map((item) => {
			const nested = item.children.find((c): c is Element =>
				isElement(c, "ul"),
			);
			const label = item.children.filter((c) => c !== nested);
			const words = textOf({ type: "root", children: label })
				.trim()
				.split(/\s+/);
			const [first = "", ...rest] = words;
			const folder = Boolean(nested) || first.endsWith("/");
			const name = first.replace(/\/$/, "") || first;
			const note = rest.join(" ").replace(/^(?:#|—|--?)\s*/, "");
			let marked = false;
			visit({ type: "root", children: label }, "element", (node) => {
				if (node.tagName === "strong") marked = true;
			});
			return element(
				"li",
				{
					className: [
						folder ? "md-dir" : "md-file",
						...(marked ? ["md-marked"] : []),
					],
				},
				[
					element("span", { className: ["md-file-name"] }, [text(name)]),
					...(note
						? [element("span", { className: ["md-file-note"] }, [text(note)])]
						: []),
					...(nested ? [fileList(nested)] : []),
				],
			);
		}),
	);
}

// ── The simple components ────────────────────────────────────────────────────

function video(node: Element): Element {
	const caption = prop(node, "dataTitle");
	return element("figure", { className: ["md-video-file"] }, [
		element("video", {
			src: prop(node, "dataSrc"),
			poster: prop(node, "dataPoster"),
			controls: true,
			preload: "metadata",
			playsInline: true,
		}),
		...(caption ? [element("figcaption", {}, [text(caption)])] : []),
	]);
}

function gallery(node: Element): Element {
	const figures: Element[] = [];
	visit(node, "element", (child) => {
		if (child.tagName !== "img") return;
		figures.push(zoomable(child, prop(child, "title")));
		return SKIP;
	});
	return element(
		"div",
		{ className: ["md-gallery"], dataCols: prop(node, "dataCols") ?? "2" },
		figures,
	);
}

export function components(tree: Root) {
	visit(tree, "element", (node, index, parent) => {
		if (!parent || index === undefined) return;
		switch (node.properties.dataComponent) {
			case "steps":
				node.properties = { className: ["md-steps"] };
				return;
			case "files": {
				const list = node.children.find((c): c is Element =>
					isElement(c, "ul"),
				);
				parent.children[index] = element(
					"div",
					{ className: ["md-files"] },
					list ? [fileList(list)] : [],
				);
				return SKIP;
			}
			case "gallery":
				parent.children[index] = gallery(node);
				return SKIP;
			case "video":
				parent.children[index] = video(node);
				return SKIP;
			case "tabs":
				// Only the panels count; the newlines between them don't.
				node.children = node.children.filter((c) => isElement(c));
				return;
			default:
				return;
		}
	});
}

// ── Repo cards ───────────────────────────────────────────────────────────────

interface RepoCard {
	url: string;
	description: string | null;
	language: string | null;
	stars: number;
	forks: number;
}

/**
 * What a `::github` card shows: the repo, `missing` (never linked: it's gone
 * or private), or `unknown` (GitHub didn't answer: a plain link).
 */
export type RepoResolver = (
	fullName: string,
) => Promise<RepoCard | "missing" | "unknown">;

export async function repos(tree: Root, resolve?: RepoResolver) {
	const jobs: Promise<void>[] = [];
	visit(tree, "element", (node, index, parent) => {
		if (node.properties.dataComponent !== "repo" || !parent) return;
		if (index === undefined) return;
		const fullName = prop(node, "dataRepo") ?? "";
		jobs.push(
			(resolve ? resolve(fullName) : Promise.resolve("unknown" as const))
				.catch(() => "unknown" as const)
				.then((repo) => {
					if (repo === "missing") {
						parent.children[index] = text("");
						return;
					}
					node.properties = {
						dataComponent: "repo",
						dataRepo: fullName,
						...(repo === "unknown"
							? { dataUrl: `https://github.com/${fullName}` }
							: {
									dataUrl: repo.url,
									dataDescription: repo.description ?? undefined,
									dataLanguage: repo.language ?? undefined,
									dataStars: String(repo.stars),
									dataForks: String(repo.forks),
								}),
					};
				}),
		);
		return SKIP;
	});
	await Promise.all(jobs);
}
