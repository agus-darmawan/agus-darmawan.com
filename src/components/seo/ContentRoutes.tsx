import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatsScope } from "@/components/content/stats/ItemStats";
import { SITE } from "@/config/site";
import { Breadcrumbs } from "@/features/site/Breadcrumbs";
import { Container } from "@/features/site/Container";
import { ArticleBody } from "@/features/site/content/ArticleBody";
import { ArticleEnd } from "@/features/site/content/ArticleEnd";
import { ContentRows } from "@/features/site/content/ContentRows";
import { DetailHeader } from "@/features/site/content/DetailHeader";
import { PostIndex } from "@/features/site/content/PostIndex";
import { ProjectCard } from "@/features/site/content/ProjectCard";
import { ProjectIndex } from "@/features/site/content/ProjectIndex";
import { PageHeader } from "@/features/site/PageHeader";
import { Section } from "@/features/site/Section";
import { SiteShell } from "@/features/site/SiteShell";
import {
	getPostsWithBody,
	getProjectsWithBody,
	renderBody,
} from "@/lib/content";
import { contentPath, listingPath } from "@/lib/content/paths";
import type {
	BlogMeta,
	ContentKind,
	ContentMeta,
	ProjectMeta,
	WithBody,
} from "@/lib/content/types";
import { itemKey } from "@/lib/meta/keys";
import {
	collectionJsonLd,
	postJsonLd,
	projectJsonLd,
	toJsonLdCrumbs,
} from "@/lib/seo/jsonld";
import { notFoundMetadata, pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "./JsonLd";

/**
 * Server logic shared by /[locale]/projects/* and /[locale]/blog/*.
 * The route files are 10-line wrappers around these helpers, so projects and
 * posts can never drift apart in SEO behavior.
 */

export type LocaleParams = { params: Promise<{ locale: string }> };
export type DetailParams = {
	params: Promise<{ locale: string; slug: string }>;
};

const loadAll = (kind: ContentKind, locale: string) =>
	(kind === "project"
		? getProjectsWithBody(locale)
		: getPostsWithBody(locale)) as Promise<WithBody<ContentMeta>[]>;

const listingKeys = {
	project: { title: "projectsTitle", description: "projectsDescription" },
	blog: { title: "blogTitle", description: "blogDescription" },
} as const;

const stripBody = ({ body: _, ...meta }: WithBody<ContentMeta>) =>
	meta as ContentMeta;

/**
 * Up to `count` items to read next: shared tags count most, then the same
 * category; ties keep the list's own order (featured and newest first).
 */
function related(item: ContentMeta, all: ContentMeta[], count = 3) {
	const score = (other: ContentMeta) =>
		other.tags.filter((tag) => item.tags.includes(tag)).length * 2 +
		(item.kind === "project" &&
		other.kind === "project" &&
		other.category === item.category
			? 1
			: 0);
	return all
		.filter((other) => other.slug !== item.slug)
		.map((other, index) => ({ other, index, score: score(other) }))
		.sort((a, b) => b.score - a.score || a.index - b.index)
		.slice(0, count)
		.map(({ other }) => other);
}

// ── Listing (/projects, /blog) ───────────────────────────────────────────────

export async function listingMetadata(
	kind: ContentKind,
	{ params }: LocaleParams,
): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Seo" });
	return pageMetadata({
		locale,
		path: listingPath(kind),
		title: t(listingKeys[kind].title),
		description: t(listingKeys[kind].description),
	});
}

export async function ListingPage({
	kind,
	params,
}: LocaleParams & { kind: ContentKind }) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations({ locale, namespace: "Seo" });
	const items = (await loadAll(kind, locale)).map(stripBody);
	const title = t(listingKeys[kind].title);
	const crumbs = [
		{ name: SITE.shortName, href: "/" },
		{ name: title, href: listingPath(kind) },
	];

	return (
		<SiteShell>
			<JsonLd
				data={collectionJsonLd(
					locale,
					listingPath(kind),
					title,
					items,
					toJsonLdCrumbs(locale, crumbs),
				)}
			/>
			<Container className="pb-20">
				<PageHeader title={title} lede={t(listingKeys[kind].description)} />
				{kind === "project" ? (
					<ProjectIndex projects={items as ProjectMeta[]} />
				) : (
					<PostIndex posts={items as BlogMeta[]} />
				)}
			</Container>
		</SiteShell>
	);
}

// ── Detail (/projects/[slug], /blog/[slug]) ──────────────────────────────────

/** Called once per locale by Next (the parent layout provides `locale`). */
export async function detailStaticParams(kind: ContentKind, locale: string) {
	return (await loadAll(kind, locale)).map(({ slug }) => ({ slug }));
}

async function findItem(kind: ContentKind, locale: string, slug: string) {
	return (await loadAll(kind, locale)).find((i) => i.slug === slug) ?? null;
}

export async function detailMetadata(
	kind: ContentKind,
	{ params }: DetailParams,
): Promise<Metadata> {
	const { locale, slug } = await params;
	const item = await findItem(kind, locale, slug);
	if (!item) return notFoundMetadata(locale);
	return {
		...pageMetadata({
			locale,
			path: contentPath(item),
			title: item.title,
			description: item.description,
			type: "article",
			publishedTime: item.date,
			tags: item.tags,
		}),
		keywords: item.tags,
	};
}

export async function DetailPage({
	kind,
	params,
}: DetailParams & { kind: ContentKind }) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const all = await loadAll(kind, locale);
	const item = all.find((i) => i.slug === slug);
	if (!item) notFound();

	const t = await getTranslations({ locale, namespace: "Seo" });
	const tc = await getTranslations({ locale, namespace: "Content" });
	const listingTitle = t(listingKeys[kind].title);
	const crumbs = [
		{ name: SITE.shortName, href: "/" },
		{ name: listingTitle, href: listingPath(kind) },
		{ name: item.title, href: contentPath(item) },
	];
	const ldCrumbs = toJsonLdCrumbs(locale, crumbs);
	const meta = stripBody(item);
	const more = related(meta, all.map(stripBody));
	const doc = await renderBody(locale, item.body);

	return (
		<SiteShell>
			<JsonLd
				data={
					item.kind === "project"
						? projectJsonLd(item, ldCrumbs)
						: postJsonLd(item, ldCrumbs)
				}
			/>

			<Container className="pb-8">
				<Breadcrumbs items={crumbs} />
				<article className="pb-16">
					<DetailHeader item={meta} />
					<ArticleBody doc={doc} accent={item.color} />
					<ArticleEnd item={meta} />
				</article>

				{more.length > 0 && (
					<Section
						id="more-heading"
						title={kind === "project" ? tc("moreProjects") : tc("morePosts")}
					>
						{kind === "project" ? (
							<StatsScope items={more.map(itemKey)}>
								<ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
									{(more as ProjectMeta[]).map((project) => (
										<li key={project.slug}>
											<ProjectCard
												project={project}
												headingLevel={3}
												sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
											/>
										</li>
									))}
								</ul>
							</StatsScope>
						) : (
							<StatsScope items={more.map(itemKey)}>
								<ContentRows items={more} headingLevel={3} />
							</StatsScope>
						)}
					</Section>
				)}
			</Container>
		</SiteShell>
	);
}

// ── OG image per item ────────────────────────────────────────────────────────

export async function ogFor(kind: ContentKind, locale: string, slug: string) {
	const item = await findItem(kind, locale, slug);
	const t = await getTranslations({ locale, namespace: "Seo" });
	return {
		item,
		eyebrow: t(kind === "project" ? "projectBy" : "postBy", {
			name: SITE.shortName,
		}),
	};
}
