"use client";

import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useContent } from "@/components/content/ContentProvider";
import {
	type ContentFilter,
	ContentWindow,
} from "@/components/content/ContentWindow";
import type { BlogMeta } from "@/lib/content/types";

export default function BlogWindow() {
	const t = useTranslations("BlogWindow");
	const tc = useTranslations("Content");
	const { posts } = useContent();

	const filter = useMemo<ContentFilter<BlogMeta>>(
		() => ({
			label: t("filterHint"),
			mode: "multi",
			options: Array.from(new Set(posts.flatMap((p) => p.tags)))
				.sort()
				.map((tag) => ({ value: tag, label: tag })),
			match: (post, tag) => post.tags.includes(tag),
		}),
		[posts, t],
	);

	return (
		<ContentWindow
			items={posts}
			filter={filter}
			hero={{
				accent: "#e95420",
				accentTo: "#77216f",
				decoration: "hatch",
				icon: <BookOpen size={15} className="text-white" />,
				title: t("title"),
				subtitle: t("subtitle", { count: posts.length }),
				description: t("headerDesc"),
			}}
			labels={{
				search: t("searchPlaceholder"),
				list: t("latestPosts"),
				empty: t("noResults"),
				back: tc("backToBlog"),
			}}
		/>
	);
}
