import type {
	Data,
	Nodes,
	Paragraph,
	Parents,
	PhrasingContent,
	Root,
} from "mdast";
import type {
	ContainerDirective,
	LeafDirective,
	TextDirective,
} from "mdast-util-directive";
import { SKIP, visit } from "unist-util-visit";
import { languageLabel, parseCodeMeta } from "./highlight.server";
import { youtubeId } from "./transforms";
import type { CalloutKind } from "./types";

/**
 * Markdown components, written as directives (`remark-directive`):
 *
 *   :::warning[Title]   ::::tabs       :::steps    :::details[Summary]
 *   :::code-group       :::tab[Label]  :::files    :::gallery{cols=3}
 *   ::youtube[Title]{id="…"}   ::video[Caption]{src="/videos/x.mp4"}
 *   ::github{repo="owner/name"}
 *
 * Directives run before sanitizing, so their markers carry a per-render
 * nonce: after sanitizing, `trustComponents` keeps only markers with the
 * right one, and raw HTML in a README can't pose as a component. Anything
 * that isn't a known directive goes back to the text it was written as
 * (`key:value` and `10:30` parse as text directives).
 */

const CALLOUTS = new Set<string>([
	"note",
	"tip",
	"important",
	"warning",
	"caution",
] satisfies CalloutKind[]);

/** Data attributes components may carry through the sanitizer. */
export const COMPONENT_PROPS = [
	"dataComponent",
	"dataNonce",
	"dataKind",
	"dataTitle",
	"dataLabel",
	"dataLabels",
	"dataIndex",
	"dataId",
	"dataSrc",
	"dataPoster",
	"dataRepo",
	"dataCols",
] as const;

type Directive = ContainerDirective | LeafDirective | TextDirective;
type ComponentProps = Partial<
	Record<(typeof COMPONENT_PROPS)[number], string | undefined>
>;

const LOCAL_OR_HTTPS = /^(?:\/(?!\/)|https:\/\/)[^\s"'<>]+$/;
const REPO = /^[\w.-]+\/[\w.-]+$/;

/** Plain text of a node: what a label or a title reads as. */
const textOf = (node: Nodes): string =>
	"value" in node && typeof node.value === "string"
		? node.value
		: "children" in node
			? node.children.map((child) => textOf(child)).join("")
			: "";

const isLabel = (node: unknown): node is Paragraph =>
	(node as Paragraph)?.type === "paragraph" &&
	(node as Paragraph).data?.directiveLabel === true;

/** The `[label]` of a container directive, removed from its children. */
function takeLabel(node: ContainerDirective) {
	const [first] = node.children;
	if (!isLabel(first)) return undefined;
	node.children.shift();
	return textOf(first).trim() || undefined;
}

function mark(
	node: Directive,
	nonce: string,
	props: ComponentProps,
	options: { tag?: string; children?: [] } = {},
) {
	const data: Data = node.data ?? {};
	data.hName = options.tag ?? "div";
	data.hProperties = { ...props, dataNonce: nonce };
	if (options.children) data.hChildren = options.children;
	node.data = data;
}

interface DirectiveOptions {
	nonce: string;
	/** The Markdown source: unknown directives go back to it verbatim. */
	source: string;
	/** Summary of a `:::details` written without one. */
	detailsLabel: string;
}

export function remarkComponents({
	nonce,
	source,
	detailsLabel,
}: DirectiveOptions) {
	const original = (node: Directive) => {
		const start = node.position?.start.offset;
		const end = node.position?.end.offset;
		return start === undefined || end === undefined
			? `:${node.name}`
			: source.slice(start, end);
	};

	/** Puts a directive back as the text it was written as. */
	const restore = (node: Directive, index: number, parent: Parents) => {
		if (node.type === "textDirective") {
			parent.children.splice(index, 1, {
				type: "text",
				value: original(node),
			} as PhrasingContent);
			return;
		}
		if (node.type === "leafDirective") {
			parent.children.splice(index, 1, {
				type: "paragraph",
				children: [{ type: "text", value: original(node) }],
			});
			return;
		}
		// An unknown container keeps its content; only the fences go.
		for (const child of node.children) {
			if (isLabel(child)) delete child.data?.directiveLabel;
		}
		parent.children.splice(index, 1, ...node.children);
	};

	function tabs(node: ContainerDirective) {
		const labels: string[] = [];
		for (const child of node.children) {
			if (child.type === "containerDirective" && child.name === "tab") {
				const label = takeLabel(child) ?? `${labels.length + 1}`;
				mark(child, nonce, {
					dataComponent: "tab",
					dataLabel: label,
					dataIndex: String(labels.length),
				});
				labels.push(label);
			}
		}
		node.children = node.children.filter(
			(child) => child.type === "containerDirective" && child.name === "tab",
		);
		return labels;
	}

	/** A run of code blocks as tabs, named by their titles or languages. */
	function codeGroup(node: ContainerDirective) {
		const labels: string[] = [];
		node.children = node.children.flatMap((child) => {
			if (child.type !== "code") return [];
			const label =
				parseCodeMeta(child.meta ?? undefined).title ??
				languageLabel(child.lang ?? "") ??
				`${labels.length + 1}`;
			const tab: ContainerDirective = {
				type: "containerDirective",
				name: "tab",
				attributes: {},
				children: [child],
			};
			mark(tab, nonce, {
				dataComponent: "tab",
				dataLabel: label,
				dataIndex: String(labels.length),
			});
			labels.push(label);
			return [tab];
		});
		return labels;
	}

	function container(node: ContainerDirective) {
		const name = node.name.toLowerCase();
		if (CALLOUTS.has(name)) {
			mark(node, nonce, {
				dataComponent: "callout",
				dataKind: name,
				dataTitle: takeLabel(node),
			});
			return true;
		}
		switch (name) {
			case "details": {
				const [first] = node.children;
				const summary: Paragraph = isLabel(first)
					? first
					: {
							type: "paragraph",
							children: [{ type: "text", value: detailsLabel }],
						};
				if (!isLabel(first)) node.children.unshift(summary);
				summary.data = { hName: "summary" };
				node.data = {
					hName: "details",
					hProperties: { open: node.attributes?.open !== undefined },
				};
				return true;
			}
			case "steps":
			case "files":
				mark(node, nonce, { dataComponent: name });
				return true;
			case "gallery": {
				const cols = Number(node.attributes?.cols);
				mark(node, nonce, {
					dataComponent: "gallery",
					dataCols: cols >= 2 && cols <= 4 ? String(cols) : "2",
				});
				return true;
			}
			case "tabs":
			case "code-group": {
				const labels = name === "tabs" ? tabs(node) : codeGroup(node);
				if (labels.length === 0) return false;
				mark(node, nonce, {
					dataComponent: "tabs",
					dataLabels: JSON.stringify(labels),
				});
				return true;
			}
			default:
				return false;
		}
	}

	function leaf(node: LeafDirective) {
		const label = textOf(node).trim() || undefined;
		const attrs = node.attributes ?? {};
		switch (node.name.toLowerCase()) {
			case "youtube": {
				const id = youtubeId(attrs.id ?? attrs.url ?? "");
				if (!id) return false;
				mark(
					node,
					nonce,
					{ dataComponent: "youtube", dataId: id, dataTitle: label },
					{ children: [] },
				);
				return true;
			}
			case "video": {
				const src = attrs.src ?? "";
				const poster = attrs.poster ?? undefined;
				if (!LOCAL_OR_HTTPS.test(src)) return false;
				if (poster && !LOCAL_OR_HTTPS.test(poster)) return false;
				mark(
					node,
					nonce,
					{
						dataComponent: "video",
						dataSrc: src,
						dataPoster: poster,
						dataTitle: label,
					},
					{ children: [] },
				);
				return true;
			}
			case "github": {
				const repo = attrs.repo ?? label ?? "";
				if (!REPO.test(repo)) return false;
				mark(
					node,
					nonce,
					{ dataComponent: "repo", dataRepo: repo },
					{ children: [] },
				);
				return true;
			}
			default:
				return false;
		}
	}

	return (tree: Root) => {
		visit(tree, (node, index, parent) => {
			if (
				index === undefined ||
				!parent ||
				(node.type !== "containerDirective" &&
					node.type !== "leafDirective" &&
					node.type !== "textDirective")
			) {
				return;
			}
			// Tabs mark their own `tab` children; a stray `tab` is unknown.
			if (node.data?.hName) return;
			const known =
				node.type === "containerDirective"
					? container(node)
					: node.type === "leafDirective"
						? leaf(node)
						: false;
			if (known) return;
			restore(node, index, parent);
			// Look at what took its place (an unwrapped container's children).
			return [SKIP, index];
		});
	};
}
