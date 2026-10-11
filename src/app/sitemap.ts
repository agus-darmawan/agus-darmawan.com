import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { localizedPath } from "@/i18n/paths";
import { routing } from "@/i18n/routing";
import { getPosts, getProjects } from "@/lib/content";
import { contentPath, listingPath } from "@/lib/content/paths";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

/** One entry per locale, each listing its translations (hreflang in sitemap). */
function localized(
	path: string,
	extra: Omit<Entry, "url" | "alternates">,
): Entry[] {
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, absoluteUrl(localizedPath(l, path))]),
	);
	return routing.locales.map((locale) => ({
		url: absoluteUrl(localizedPath(locale, path)),
		alternates: { languages },
		...extra,
	}));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const locale = routing.defaultLocale;
	const [projects, posts] = await Promise.all([
		getProjects(locale),
		getPosts(locale),
	]);

	const lastModified = (date: string | null) =>
		date ? new Date(date) : undefined;

	return [
		...localized("", { changeFrequency: "monthly", priority: 1 }),
		...localized("/about", { changeFrequency: "monthly", priority: 0.9 }),
		...localized(listingPath("project"), {
			changeFrequency: "weekly",
			priority: 0.8,
		}),
		...localized(listingPath("blog"), {
			changeFrequency: "weekly",
			priority: 0.8,
		}),
		...projects.flatMap((p) =>
			localized(contentPath(p), {
				lastModified: lastModified(p.date),
				changeFrequency: "monthly",
				priority: p.featured ? 0.7 : 0.6,
			}),
		),
		...posts.flatMap((p) =>
			localized(contentPath(p), {
				lastModified: lastModified(p.date),
				changeFrequency: "yearly",
				priority: 0.6,
			}),
		),
	];
}
