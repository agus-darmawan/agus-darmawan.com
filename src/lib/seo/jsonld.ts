import { absoluteUrl, SITE } from "@/config/site";
import { localizedPath } from "@/i18n/paths";
import { contentPath } from "@/lib/content/paths";
import type { BlogMeta, ContentMeta, ProjectMeta } from "@/lib/content/types";

/**
 * schema.org structured data. The Person entity has a stable @id so every
 * page (projects, posts, about, website) points at the SAME person — that's
 * what lets Google build a knowledge panel for "Agus Darmawan" instead of
 * guessing which of the many Agus Darmawans this site is about.
 */

const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

type Thing = Record<string, unknown>;
export type Crumb = { name: string; path: string };

/** UI breadcrumbs ({ name, href } with locale-less hrefs) → JSON-LD crumbs. */
export const toJsonLdCrumbs = (
	locale: string,
	crumbs: { name: string; href: string }[],
): Crumb[] =>
	crumbs.map((c) => ({
		name: c.name,
		path: localizedPath(locale, c.href === "/" ? "" : c.href),
	}));

const graph = (...nodes: Thing[]) => ({
	"@context": "https://schema.org",
	"@graph": nodes,
});

interface PersonDetails {
	description?: string;
	awards?: string[];
	education?: { name: string; url?: string }[];
	skills?: string[];
}

function personJsonLd({
	description,
	awards,
	education,
	skills,
}: PersonDetails = {}): Thing {
	return {
		"@type": "Person",
		"@id": PERSON_ID,
		name: SITE.name,
		alternateName: SITE.alternateNames,
		jobTitle: SITE.jobTitle,
		...(description && { description }),
		url: SITE.url,
		image: absoluteUrl("/avatar.png"),
		email: `mailto:${SITE.email}`,
		address: {
			"@type": "PostalAddress",
			addressLocality: SITE.location.locality,
			addressRegion: SITE.location.region,
			addressCountry: SITE.location.country,
		},
		worksFor: { "@type": "Organization", name: SITE.worksFor.name },
		alumniOf: (education ?? [SITE.alumniOf]).map((school) => ({
			"@type": "EducationalOrganization",
			name: school.name,
			...(school.url && { url: school.url }),
		})),
		knowsAbout: [...new Set([...SITE.knowsAbout, ...(skills ?? [])])],
		...(awards?.length && { award: awards }),
		sameAs: Object.values(SITE.socials),
	};
}

function websiteJsonLd(locale: string): Thing {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		url: SITE.url,
		name: SITE.shortName,
		alternateName: [SITE.name, "agus-darmawan.com"],
		inLanguage: locale,
		publisher: { "@id": PERSON_ID },
	};
}

function breadcrumbJsonLd(items: Crumb[]): Thing {
	return {
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	};
}

/** Home (the desktop): the website + the person it is about. */
export function homeJsonLd(locale: string, bio: string) {
	const url = absoluteUrl(localizedPath(locale));
	return graph(websiteJsonLd(locale), personJsonLd({ description: bio }), {
		"@type": "WebPage",
		"@id": `${url}#webpage`,
		url,
		name: `${SITE.shortName} — ${SITE.jobTitle}`,
		inLanguage: locale,
		isPartOf: { "@id": WEBSITE_ID },
		about: { "@id": PERSON_ID },
	});
}

interface AboutJsonLdInput extends PersonDetails {
	locale: string;
	publications: { title: string; url: string; year: string; venue: string }[];
	breadcrumbs: Crumb[];
}

/** /about: the canonical ProfilePage for the person, with their papers. */
export function aboutJsonLd({
	locale,
	publications,
	breadcrumbs,
	...person
}: AboutJsonLdInput) {
	const url = absoluteUrl(localizedPath(locale, "/about"));
	return graph(
		{
			"@type": "ProfilePage",
			"@id": `${url}#profile`,
			url,
			inLanguage: locale,
			isPartOf: { "@id": WEBSITE_ID },
			mainEntity: { "@id": PERSON_ID },
		},
		personJsonLd(person),
		...publications.map((pub) => ({
			"@type": "ScholarlyArticle",
			"@id": `${pub.url}#article`,
			headline: pub.title,
			url: pub.url,
			datePublished: pub.year,
			publisher: { "@type": "Organization", name: pub.venue },
			author: { "@id": PERSON_ID },
		})),
		breadcrumbJsonLd(breadcrumbs),
	);
}

/** /projects and /blog listings. */
export function collectionJsonLd(
	locale: string,
	path: string,
	name: string,
	items: ContentMeta[],
	breadcrumbs: Crumb[],
) {
	const url = absoluteUrl(localizedPath(locale, path));
	return graph(
		{
			"@type": "CollectionPage",
			"@id": `${url}#collection`,
			url,
			name,
			inLanguage: locale,
			isPartOf: { "@id": WEBSITE_ID },
			author: { "@id": PERSON_ID },
			mainEntity: {
				"@type": "ItemList",
				itemListElement: items.map((item, i) => ({
					"@type": "ListItem",
					position: i + 1,
					url: absoluteUrl(localizedPath(locale, contentPath(item))),
					name: item.title,
				})),
			},
		},
		breadcrumbJsonLd(breadcrumbs),
		personJsonLd(),
	);
}

export function projectJsonLd(project: ProjectMeta, breadcrumbs: Crumb[]) {
	const url = absoluteUrl(localizedPath(project.locale, contentPath(project)));
	return graph(
		{
			"@type": project.repoUrl ? "SoftwareSourceCode" : "CreativeWork",
			"@id": `${url}#work`,
			name: project.title,
			description: project.description,
			url,
			inLanguage: project.locale,
			keywords: project.tags.join(", "),
			author: { "@id": PERSON_ID },
			creator: { "@id": PERSON_ID },
			...(project.date && { dateCreated: project.date }),
			...(project.repoUrl && {
				codeRepository: project.repoUrl,
				sameAs: project.repoUrl,
			}),
			image: `${url}/opengraph-image`,
		},
		breadcrumbJsonLd(breadcrumbs),
		personJsonLd(),
	);
}

export function postJsonLd(post: BlogMeta, breadcrumbs: Crumb[]) {
	const url = absoluteUrl(localizedPath(post.locale, contentPath(post)));
	return graph(
		{
			"@type": "BlogPosting",
			"@id": `${url}#article`,
			headline: post.title,
			description: post.description,
			url,
			mainEntityOfPage: url,
			inLanguage: post.locale,
			datePublished: post.date,
			dateModified: post.date,
			keywords: post.tags.join(", "),
			timeRequired: `PT${post.readingTime}M`,
			author: { "@id": PERSON_ID },
			publisher: { "@id": PERSON_ID },
			image: `${url}/opengraph-image`,
		},
		breadcrumbJsonLd(breadcrumbs),
		personJsonLd(),
	);
}
