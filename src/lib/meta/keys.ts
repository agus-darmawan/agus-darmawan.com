import type { ContentKind } from "@/lib/content/types";

/** How views and likes name an item: `project:pashupati`, `blog:my-post`. */
export const itemKey = ({ kind, slug }: { kind: ContentKind; slug: string }) =>
	`${kind}:${slug}`;

export const ITEM_KEY = /^(?:project|blog):[\w.-]{1,100}$/;
