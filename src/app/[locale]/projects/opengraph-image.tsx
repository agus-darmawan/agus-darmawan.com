import { getTranslations } from "next-intl/server";
import { SITE } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

// Page-level openGraph metadata replaces the layout's, so listings need
// their own card (otherwise /projects and /blog shared with no image).
export const alt = SITE.shortName;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Seo" });
	return renderOgCard({
		eyebrow: SITE.shortName,
		title: t("projectsTitle"),
		subtitle: t("projectsDescription"),
	});
}
