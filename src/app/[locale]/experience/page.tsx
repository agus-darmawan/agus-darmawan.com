import { Download } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { resumeUrl, SITE } from "@/config/site";
import { EXPERIENCES } from "@/features/experience/experience.data";
import { experienceSummary } from "@/features/experience/experience.utils";
import { buttonClass } from "@/features/site/button";
import { Container } from "@/features/site/Container";
import { CareerTimeline } from "@/features/site/experience/CareerTimeline";
import { PageHeader } from "@/features/site/PageHeader";
import { SiteShell } from "@/features/site/SiteShell";
import { pageJsonLd, toJsonLdCrumbs } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

const PATH = "/experience";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Seo" });
	return pageMetadata({
		locale,
		path: PATH,
		title: t("experienceTitle"),
		description: t("experienceDescription"),
		type: "profile",
	});
}

/** Work history on its own page (the desktop has a separate window for it). */
export default async function ExperiencePage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [t, site, exp] = await Promise.all([
		getTranslations({ locale, namespace: "Seo" }),
		getTranslations({ locale, namespace: "Site" }),
		getTranslations({ locale, namespace: "ExperienceWindow" }),
	]);
	const crumbs = [
		{ name: SITE.shortName, href: "/" },
		{ name: t("experienceTitle"), href: PATH },
	];
	const summary = experienceSummary(EXPERIENCES);
	const cv = resumeUrl(locale);

	return (
		<SiteShell>
			<JsonLd
				data={pageJsonLd({
					locale,
					path: PATH,
					name: t("experienceTitle"),
					breadcrumbs: toJsonLdCrumbs(locale, crumbs),
				})}
			/>
			<Container className="pb-24">
				<PageHeader title={t("experienceTitle")} lede={exp("headerDesc")}>
					<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
						<p className="text-(--site-ink)">
							{site("experience.summary", {
								roles: summary.roles,
								orgs: summary.orgs,
								year: String(summary.since),
							})}
						</p>
						{cv && (
							<a href={cv} className={buttonClass("secondary")}>
								<Download className="size-4" aria-hidden />
								{t("downloadCv")}
							</a>
						)}
					</div>
				</PageHeader>
				<div className="border-t border-(--site-line) pt-12">
					<CareerTimeline />
				</div>
			</Container>
		</SiteShell>
	);
}
