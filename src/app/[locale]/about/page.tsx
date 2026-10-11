import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/config/site";
import {
	AWARDS,
	EDUCATION,
	PUBLICATIONS,
	SKILL_GROUPS,
} from "@/features/about/about.data";
import { AwardsList } from "@/features/site/about/AwardsList";
import { EducationList } from "@/features/site/about/EducationList";
import { ProfileHeader } from "@/features/site/about/ProfileHeader";
import { PublicationsList } from "@/features/site/about/PublicationsList";
import { SkillGroups } from "@/features/site/about/SkillGroups";
import { Container } from "@/features/site/Container";
import { Section } from "@/features/site/Section";
import { SiteShell } from "@/features/site/SiteShell";
import { aboutJsonLd, toJsonLdCrumbs } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

const PATH = "/about";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Seo" });
	return pageMetadata({
		locale,
		path: PATH,
		title: t("aboutPageTitle"),
		absoluteTitle: true,
		description: t("aboutDescription"),
		type: "profile",
	});
}

/**
 * The page that should rank for "Agus Darmawan": who he is, what he knows,
 * where he studied, awards and papers. Work history has its own page.
 */
export default async function AboutPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [t, about] = await Promise.all([
		getTranslations({ locale, namespace: "Seo" }),
		getTranslations({ locale, namespace: "AboutWindow" }),
	]);

	const crumbs = [
		{ name: SITE.shortName, href: "/" },
		{ name: t("aboutTitle"), href: PATH },
	];

	return (
		<SiteShell>
			<JsonLd
				data={aboutJsonLd({
					locale,
					description: about("bio"),
					awards: AWARDS.map((a) => `${a.title} — ${a.event}`),
					education: EDUCATION.map((e) => ({
						name: about(e.institutionKey),
						url: e.url,
					})),
					skills: SKILL_GROUPS.flatMap((g) => g.skills),
					publications: PUBLICATIONS.map((p) => ({
						title: about(p.titleKey),
						url: p.url,
						year: p.year,
						venue: about(p.venueKey),
					})),
					breadcrumbs: toJsonLdCrumbs(locale, crumbs),
				})}
			/>
			<Container className="pb-8">
				<ProfileHeader />
				<Section id="skills" title={about("skills")}>
					<SkillGroups />
				</Section>
				<Section id="education" title={about("education")}>
					<EducationList />
				</Section>
				{/* One rule across both columns; stacked, publications get their own. */}
				<div className="grid gap-x-16 border-t border-(--site-line) lg:grid-cols-2">
					<Section id="awards" title={about("awards")} className="border-t-0">
						<AwardsList />
					</Section>
					<Section
						id="publications"
						title={about("publications")}
						className="lg:border-t-0"
					>
						<PublicationsList />
					</Section>
				</div>
			</Container>
		</SiteShell>
	);
}
