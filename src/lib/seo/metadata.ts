import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, SITE } from "@/config/site";
import { localizedPath } from "@/i18n/paths";
import { routing } from "@/i18n/routing";

const OG_LOCALE: Record<string, string> = { en: "en_US", id: "id_ID" };

/**
 * canonical + hreflang for every locale (+ x-default → default locale).
 * Every indexable page must call this, otherwise /en and /id compete as
 * duplicates instead of being treated as translations.
 */
export function alternates(locale: string, path = ""): Metadata["alternates"] {
	return {
		canonical: absoluteUrl(localizedPath(locale, path)),
		languages: {
			...Object.fromEntries(
				routing.locales.map((l) => [l, absoluteUrl(localizedPath(l, path))]),
			),
			"x-default": absoluteUrl(localizedPath(routing.defaultLocale, path)),
		},
	};
}

interface PageMetaInput {
	locale: string;
	path: string;
	title: string;
	/** Use the title as-is instead of the "%s · Agus Darmawan" template. */
	absoluteTitle?: boolean;
	description: string;
	type?: "website" | "article" | "profile";
	publishedTime?: string | null;
	tags?: string[];
}

/** Consistent title/description/OG/Twitter/hreflang for any page. */
export function pageMetadata({
	locale,
	path,
	title,
	absoluteTitle = false,
	description,
	type = "website",
	publishedTime,
	tags,
}: PageMetaInput): Metadata {
	const url = absoluteUrl(localizedPath(locale, path));
	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		alternates: alternates(locale, path),
		openGraph: {
			title,
			description,
			url,
			type,
			siteName: SITE.shortName,
			locale: OG_LOCALE[locale] ?? locale,
			alternateLocale: routing.locales
				.filter((l) => l !== locale)
				.map((l) => OG_LOCALE[l] ?? l),
			...(type === "article" && {
				authors: [SITE.url],
				...(publishedTime && { publishedTime }),
				...(tags?.length && { tags }),
			}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			creator: SITE.twitterHandle,
		},
	};
}

/** Title + noindex for 404s (the layout's "index, follow" would apply otherwise). */
export async function notFoundMetadata(locale: string): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: "Seo" });
	return { title: t("notFoundTitle"), robots: { index: false, follow: true } };
}
