import { Download, FolderGit2, Mail } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/seo/PageShell";
import { resumeUrl, SITE } from "@/config/site";
import { AboutContent } from "@/features/about/AboutContent";
import { AboutSection } from "@/features/about/AboutSection";
import {
	AWARDS,
	EDUCATION,
	PUBLICATIONS,
	SKILL_GROUPS,
} from "@/features/about/about.data";
import { ExperienceTimeline } from "@/features/experience/ExperienceCard";
import { EXPERIENCES } from "@/features/experience/experience.data";
import { Link } from "@/i18n/navigation";
import { listingPath } from "@/lib/content/paths";
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
 * Crawlable, visible version of the About + Experience windows — the page
 * that should rank for "Agus Darmawan". Same components as the desktop.
 */
export default async function AboutPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [t, about, tExp] = await Promise.all([
		getTranslations({ locale, namespace: "Seo" }),
		getTranslations({ locale, namespace: "AboutWindow" }),
		getTranslations({ locale, namespace: "ExperienceWindow" }),
	]);

	const crumbs = [
		{ name: SITE.shortName, href: "/" },
		{ name: t("aboutTitle"), href: PATH },
	];
	const cv = resumeUrl(locale);

	return (
		<PageShell path={PATH} breadcrumbs={crumbs}>
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

			<article className="rounded-2xl overflow-hidden border border-(--border) bg-(--surface)">
				<AboutContent>
					<AboutSection title={tExp("title")}>
						<ExperienceTimeline entries={EXPERIENCES} headingLevel={3} />
					</AboutSection>
				</AboutContent>

				<footer className="flex flex-wrap gap-2 px-6 py-5">
					{cv && (
						<a
							href={cv}
							className="inline-flex items-center gap-1.5 rounded-lg bg-[#e95420] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
						>
							<Download size={13} aria-hidden="true" />
							{t("downloadCv")}
						</a>
					)}
					<a
						href={`mailto:${SITE.email}`}
						className="inline-flex items-center gap-1.5 rounded-lg border border-(--border) px-3 py-1.5 text-xs font-medium text-(--text-secondary) hover:border-[#e95420] hover:text-[#e95420]"
					>
						<Mail size={13} aria-hidden="true" />
						{t("emailMe")}
					</a>
					<Link
						href={listingPath("project")}
						className="inline-flex items-center gap-1.5 rounded-lg border border-(--border) px-3 py-1.5 text-xs font-medium text-(--text-secondary) hover:border-[#e95420] hover:text-[#e95420]"
					>
						<FolderGit2 size={13} aria-hidden="true" />
						{t("projectsTitle")}
					</Link>
				</footer>
			</article>
		</PageShell>
	);
}
