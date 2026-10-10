import { getTranslations } from "next-intl/server";
import { SITE } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = `${SITE.name} — ${SITE.jobTitle}`;
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
		eyebrow: t("aboutTitle"),
		title: "I Wayan Agus",
		titleAccent: "Darmawan",
		subtitle: t("aboutDescription"),
		tags: ["ROS2", "Robotics", "Quadruped", "Next.js", "TypeScript"],
	});
}
