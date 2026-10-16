import { accentStyle } from "@/components/content/primitives";
import { MarkdownContent } from "@/components/markdown/MarkdownContent";
import type { MarkdownDoc } from "@/lib/markdown/types";
import { ArticleToc } from "./ArticleToc";

/**
 * The text of a project or post with its contents beside it. The contents
 * come first in the source: above the text on phones, in the right column
 * (sticky) from `lg`.
 */
export function ArticleBody({
	doc,
	accent,
}: {
	doc: MarkdownDoc;
	accent: string;
}) {
	return (
		<div
			style={accentStyle(accent)}
			className="grid border-t border-(--site-line) pt-10 lg:grid-cols-[minmax(0,37.5rem)_16rem] lg:justify-between lg:gap-x-12"
		>
			{doc.toc.length > 1 && (
				<aside className="lg:col-start-2 lg:row-start-1">
					<ArticleToc toc={doc.toc} />
				</aside>
			)}
			<MarkdownContent
				tree={doc.tree}
				className="min-w-0 lg:col-start-1 lg:row-start-1"
			/>
		</div>
	);
}
