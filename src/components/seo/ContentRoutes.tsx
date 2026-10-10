import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContentCard } from "@/components/content/ContentCard";
import { ContentHeader } from "@/components/content/ContentHeader";
import { accentStyle } from "@/components/content/primitives";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { SITE } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getPostsWithBody, getProjectsWithBody } from "@/lib/content";
import { contentPath, listingPath } from "@/lib/content/paths";
import type { ContentKind, ContentMeta, WithBody } from "@/lib/content/types";
import {
	collectionJsonLd,
	postJsonLd,
	projectJsonLd,
	toJsonLdCrumbs,
} from "@/lib/seo/jsonld";
import { notFoundMetadata, pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "./JsonLd";
import { PageShell } from "./PageShell";

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
		<PageShell path={listingPath(kind)} breadcrumbs={crumbs}>
			<JsonLd
				data={collectionJsonLd(
					locale,
					listingPath(kind),
					title,
					items,
					toJsonLdCrumbs(locale, crumbs),
				)}
			/>
			<h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
			<p className="mt-2 mb-6 text-sm text-(--text-secondary) max-w-2xl">
				{t(listingKeys[kind].description)}
			</p>
			<ul className="grid gap-4 sm:grid-cols-2">
				{items.map((item) => (
					<li key={item.slug}>
						<ContentCard item={item} />
					</li>
				))}
			</ul>
		</PageShell>
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
	const more = all
		.filter((i) => i.slug !== item.slug)
		.slice(0, 2)
		.map(stripBody);

	return (
		<PageShell path={contentPath(item)} breadcrumbs={crumbs}>
			<JsonLd
				data={
					item.kind === "project"
						? projectJsonLd(item, ldCrumbs)
						: postJsonLd(item, ldCrumbs)
				}
			/>

			<article className="rounded-2xl overflow-hidden border border-(--border) bg-(--surface)">
				<ContentHeader item={stripBody(item)} as="h1" />
				<div
					style={accentStyle(item.color)}
					className="px-5 sm:px-8 py-6 [&_p]:text-sm [&_li]:text-sm [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base"
				>
					<MarkdownRenderer content={item.body} accentColor={item.color} />
				</div>
			</article>

			{more.length > 0 && (
				<section className="mt-10" aria-labelledby="more-heading">
					<h2 id="more-heading" className="text-lg font-semibold mb-4">
						{kind === "project" ? tc("moreProjects") : tc("morePosts")}
					</h2>
					<ul className="grid gap-4 sm:grid-cols-2">
						{more.map((m) => (
							<li key={m.slug}>
								<ContentCard item={m} />
							</li>
						))}
					</ul>
				</section>
			)}
		</PageShell>
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
