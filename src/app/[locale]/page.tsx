import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { AwardsList } from "@/features/site/about/AwardsList";
import { PublicationsList } from "@/features/site/about/PublicationsList";
import { textLinkClass } from "@/features/site/button";
import { Container } from "@/features/site/Container";
import { ContentRows } from "@/features/site/content/ContentRows";
import { ContactCta } from "@/features/site/home/ContactCta";
import { HomeHero } from "@/features/site/home/HomeHero";
import { RecentExperience } from "@/features/site/home/RecentExperience";
import { Section } from "@/features/site/Section";
import { SiteShell } from "@/features/site/SiteShell";
import { Link } from "@/i18n/navigation";
import { getPosts, getProjects } from "@/lib/content";
import { homeJsonLd } from "@/lib/seo/jsonld";

// Re-generate hourly so GitHub stars / auto-discovered repos stay fresh.
export const revalidate = 3600;

const SUBHEADING = "mb-5 text-lg font-medium text-(--site-ink)";

/**
 * The classic home page: who, proof, contact. The interactive desktop lives
 * at /desktop; the hero's preview (and the header) lead there.
 */
export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [projects, posts, about, t] = await Promise.all([
		getProjects(locale),
		getPosts(locale),
		getTranslations({ locale, namespace: "AboutWindow" }),
		getTranslations({ locale, namespace: "Site" }),
	]);
	const featured = projects.filter((p) => p.featured);
	const selected = (featured.length > 0 ? featured : projects).slice(0, 4);

	return (
		<SiteShell>
			<JsonLd data={homeJsonLd(locale, about("bio"))} />
			<Container className="pb-8">
				<HomeHero preview={selected.slice(0, 3)} />

				<Section
					id="work"
					title={t("work.title")}
					action={
						<Link href="/projects" className={textLinkClass}>
							{t("work.all", { count: projects.length })}
						</Link>
					}
				>
					<ContentRows items={selected} headingLevel={3} />
				</Section>

				<Section
					id="experience"
					title={t("experience.title")}
					action={
						<Link href="/experience" className={textLinkClass}>
							{t("experience.all")}
						</Link>
					}
				>
					<RecentExperience />
				</Section>

				<Section id="recognition" title={t("recognition.title")}>
					<div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
						<div>
							<h3 className={SUBHEADING}>{t("recognition.awards")}</h3>
							<AwardsList limit={4} />
						</div>
						<div>
							<h3 className={SUBHEADING}>{t("recognition.publications")}</h3>
							<PublicationsList />
						</div>
					</div>
				</Section>

				{posts.length > 0 && (
					<Section
						id="writing"
						title={t("writing.title")}
						action={
							<Link href="/blog" className={textLinkClass}>
								{t("writing.all")}
							</Link>
						}
					>
						<ContentRows items={posts.slice(0, 3)} headingLevel={3} />
					</Section>
				)}

				<ContactCta />
			</Container>
		</SiteShell>
	);
}
