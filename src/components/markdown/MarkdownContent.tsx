import type { Root } from "hast";
import { type Components, toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { ComponentProps } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { RepoCard } from "./RepoCard";
import { TabPanel, Tabs } from "./Tabs";
import { YoutubeBlock } from "./YoutubeBlock";
import { ZoomFigure } from "./ZoomFigure";

/**
 * Renders a prepared Markdown tree (see `renderMarkdown`). No directive on
 * purpose: on the website it renders on the server, so only the interactive
 * bits (copy button, tabs, image zoom, video embed) ship as client code; in
 * the desktop windows it runs in the browser on the same tree.
 */

type PlaceholderProps = ComponentProps<"div"> &
	Partial<
		Record<
			| "data-component"
			| "data-lang"
			| "data-title"
			| "data-kind"
			| "data-id"
			| "data-labels"
			| "data-index"
			| "data-repo"
			| "data-url"
			| "data-description"
			| "data-language"
			| "data-stars"
			| "data-forks",
			string
		>
	>;

/** The pipeline marks components as `<div data-component="…">`. */
function Div({ children, ...props }: PlaceholderProps) {
	switch (props["data-component"]) {
		case "code":
			return (
				<CodeBlock lang={props["data-lang"]} title={props["data-title"]}>
					{children}
				</CodeBlock>
			);
		case "callout":
			return (
				<Callout kind={props["data-kind"]} title={props["data-title"]}>
					{children}
				</Callout>
			);
		case "tabs":
			return <Tabs labels={props["data-labels"]}>{children}</Tabs>;
		case "tab":
			return <TabPanel index={props["data-index"]}>{children}</TabPanel>;
		case "repo":
			return (
				<RepoCard
					repo={props["data-repo"]}
					url={props["data-url"]}
					description={props["data-description"]}
					language={props["data-language"]}
					stars={props["data-stars"]}
					forks={props["data-forks"]}
				/>
			);
		case "youtube":
			return props["data-id"] ? (
				<YoutubeBlock videoId={props["data-id"]} title={props["data-title"]} />
			) : null;
		default:
			return <div {...props}>{children}</div>;
	}
}

type FigureProps = ComponentProps<"figure"> &
	Partial<Record<"data-zoom" | "data-src" | "data-alt", string>>;

/** Lone images and gallery items are `<figure data-zoom>`. */
function Figure({ children, ...props }: FigureProps) {
	if (props["data-zoom"] === undefined) {
		return <figure {...props}>{children}</figure>;
	}
	return (
		<ZoomFigure src={props["data-src"]} alt={props["data-alt"]}>
			{children}
		</ZoomFigure>
	);
}

const components: Partial<Components> = { div: Div, figure: Figure };

export type MarkdownSize = "comfortable" | "compact";

export function MarkdownContent({
	tree,
	size = "comfortable",
	className,
}: {
	tree: Root;
	/** comfortable on article pages, compact in desktop windows. */
	size?: MarkdownSize;
	className?: string;
}) {
	return (
		<div className={cn("md", size === "compact" && "md-compact", className)}>
			{toJsxRuntime(tree, { Fragment, jsx, jsxs, components })}
		</div>
	);
}
