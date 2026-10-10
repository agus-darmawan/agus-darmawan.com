import { ogFor } from "@/components/seo/ContentRoutes";
import { SITE } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = SITE.shortName;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { locale, slug } = await params;
	const { item, eyebrow } = await ogFor("project", locale, slug);
	return renderOgCard({
		eyebrow,
		title: item?.title ?? SITE.shortName,
		subtitle: item?.description ?? SITE.jobTitle,
		tags: item?.tags,
		accent: item?.color,
	});
}
