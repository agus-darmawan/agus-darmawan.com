import type { ContentKind } from "./types";

/** Locale-less path; pass it to next-intl's <Link>/router or prefix the locale. */
export function contentPath(item: { kind: ContentKind; slug: string }): string {
	return item.kind === "project"
		? `/projects/${item.slug}`
		: `/blog/${item.slug}`;
}

export const listingPath = (kind: ContentKind) =>
	kind === "project" ? "/projects" : "/blog";
