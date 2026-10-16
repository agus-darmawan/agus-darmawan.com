import type { Root } from "hast";
import { type Components, toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { ComponentProps } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { YoutubeBlock } from "./YoutubeBlock";

/**
 * Renders a prepared Markdown tree (see `renderMarkdown`). No directive on
 * purpose: on the website it renders on the server, so only the copy button
 * and the video embed ship as client code; in the desktop windows it runs in
 * the browser on the same tree.
 */

type PlaceholderProps = ComponentProps<"div"> & {
	"data-component"?: string;
	"data-lang"?: string;
	"data-title"?: string;
	"data-kind"?: string;
	"data-id"?: string;
};

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
			return <Callout kind={props["data-kind"]}>{children}</Callout>;
		case "youtube":
			return props["data-id"] ? (
				<YoutubeBlock videoId={props["data-id"]} title={props["data-title"]} />
			) : null;
		default:
			return <div {...props}>{children}</div>;
	}
}

const components: Partial<Components> = { div: Div };

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
