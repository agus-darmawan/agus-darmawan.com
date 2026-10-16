import "server-only";
import { getTranslations } from "next-intl/server";
import { cache } from "react";
import { renderMarkdown } from "@/lib/markdown/render.server";
import type { MarkdownDoc } from "@/lib/markdown/types";

/**
 * A content body as a prepared document, with the footnote labels in the
 * page's language. Memoized per request (metadata and page share it).
 */
export const renderBody = cache(
	async (locale: string, body: string): Promise<MarkdownDoc> => {
		const t = await getTranslations({ locale, namespace: "Content" });
		return renderMarkdown(body, {
			footnoteLabel: t("footnotes"),
			footnoteBackLabel: (n) => t("backToReference", { n }),
		});
	},
);
