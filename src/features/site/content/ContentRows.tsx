import type { ContentMeta } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { PostRow } from "./PostRow";
import { ProjectRow } from "./ProjectRow";

/**
 * Projects and posts as ruled rows, one component per kind. Inside a home
 * section the next section's rule closes the list, so `trailingRule` is off
 * there to avoid two lines in a row.
 */
export function ContentRows({
	items,
	headingLevel = 2,
	trailingRule = true,
}: {
	items: ContentMeta[];
	headingLevel?: 2 | 3;
	trailingRule?: boolean;
}) {
	return (
		<ul className="border-t border-(--site-line)">
			{items.map((item) => (
				<li
					key={item.slug}
					className={cn(
						"border-b border-(--site-line)",
						!trailingRule && "last:border-b-0",
					)}
				>
					{item.kind === "project" ? (
						<ProjectRow project={item} headingLevel={headingLevel} />
					) : (
						<PostRow post={item} headingLevel={headingLevel} />
					)}
				</li>
			))}
		</ul>
	);
}
