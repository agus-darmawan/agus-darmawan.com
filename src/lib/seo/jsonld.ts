import { absoluteUrl, SITE } from "@/config/site";
import { contentPath } from "@/lib/content/paths";
import type { BlogMeta, ProjectMeta } from "@/lib/content/types";
import { localizedPath } from "./metadata";

/**
 * schema.org structured data. The Person entity has a stable @id so every
 * page (projects, posts, website) points at the SAME person — that's what
 * lets Google build a knowledge panel for "Agus Darmawan" instead of
 * guessing which of the many Agus Darmawans this site is about.
 */

const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

type Thing = Record<string, unknown>;

function personJsonLd(description?: string): Thing {
	return {
		"@type": "Person",
		"@id": PERSON_ID,
		name: SITE.name,
		alternateName: SITE.alternateNames,
		jobTitle: SITE.jobTitle,
		description,
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
		alumniOf: {
			"@type": "CollegeOrUniversity",
			name: SITE.alumniOf.name,
			url: SITE.alumniOf.url,
		},
		knowsAbout: SITE.knowsAbout,
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

/** Home page: ProfilePage whose mainEntity is the Person. */
export function profilePageJsonLd(locale: string, bio: string): Thing {
	return {
		"@context": "https://schema.org",
		"@graph": [
			websiteJsonLd(locale),
			personJsonLd(bio),
			{
				"@type": "ProfilePage",
				"@id": `${absoluteUrl(localizedPath(locale))}#profile`,
				url: absoluteUrl(localizedPath(locale)),
				inLanguage: locale,
				isPartOf: { "@id": WEBSITE_ID },
				mainEntity: { "@id": PERSON_ID },
			},
		],
	};
}

function breadcrumbJsonLd(items: { name: string; path: string }[]): Thing {
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

export function projectJsonLd(
	project: ProjectMeta,
	breadcrumbs: { name: string; path: string }[],
): Thing {
	const url = absoluteUrl(localizedPath(project.locale, contentPath(project)));
	const work: Thing = {
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
	};
	return {
		"@context": "https://schema.org",
		"@graph": [work, breadcrumbJsonLd(breadcrumbs), personJsonLd()],
	};
}

export function postJsonLd(
	post: BlogMeta,
	breadcrumbs: { name: string; path: string }[],
): Thing {
	const url = absoluteUrl(localizedPath(post.locale, contentPath(post)));
	return {
		"@context": "https://schema.org",
		"@graph": [
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
		],
	};
}
