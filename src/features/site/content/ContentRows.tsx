import type { ContentMeta } from "@/lib/content/types";
import { PostRow } from "./PostRow";
import { ProjectRow } from "./ProjectRow";

/** Projects and posts as ruled rows, one component per kind. */
export function ContentRows({
	items,
	headingLevel = 2,
}: {
	items: ContentMeta[];
	headingLevel?: 2 | 3;
}) {
	return (
		<ul className="border-t border-(--site-line)">
			{items.map((item) => (
				<li key={item.slug} className="border-b border-(--site-line)">
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
