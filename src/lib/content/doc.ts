import "server-only";
import { getTranslations } from "next-intl/server";
import { cache } from "react";
import type { RepoResolver } from "@/lib/markdown/components";
import { renderMarkdown } from "@/lib/markdown/render.server";
import type { MarkdownDoc } from "@/lib/markdown/types";
import { getRepo } from "./github";

/** `::github` cards read the same (cached) GitHub data as project pages. */
const resolveRepo: RepoResolver = async (fullName) => {
	const lookup = await getRepo(fullName);
	if (lookup.status !== "ok") return lookup.status;
	const { repo } = lookup;
	return {
		url: repo.html_url,
		description: repo.description,
		language: repo.language,
		stars: repo.stargazers_count,
		forks: repo.forks_count,
	};
};

/**
 * A content body as a prepared document, with its labels in the page's
 * language. Memoized per request (metadata and page share it).
 */
export const renderBody = cache(
	async (locale: string, body: string): Promise<MarkdownDoc> => {
		const t = await getTranslations({ locale, namespace: "Content" });
		return renderMarkdown(body, {
			footnoteLabel: t("footnotes"),
			footnoteBackLabel: (n) => t("backToReference", { n }),
			detailsLabel: t("details"),
			resolveRepo,
		});
	},
);
