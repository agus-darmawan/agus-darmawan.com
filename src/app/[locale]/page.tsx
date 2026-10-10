import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContentProvider } from "@/components/content/ContentProvider";
import { HomeProfile } from "@/components/seo/HomeProfile";
import { JsonLd } from "@/components/seo/JsonLd";
import { Desktop } from "@/features/desktop/Desktop";
import { getPosts, getProjects } from "@/lib/content";
import { profilePageJsonLd } from "@/lib/seo/jsonld";

// Re-generate hourly so GitHub stars / auto-discovered repos stay fresh.
export const revalidate = 3600;

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [projects, posts, about] = await Promise.all([
		getProjects(locale),
		getPosts(locale),
		getTranslations({ locale, namespace: "AboutWindow" }),
	]);

	return (
		<>
			<JsonLd data={profilePageJsonLd(locale, about("bio"))} />
			<HomeProfile projects={projects} posts={posts} />
			<ContentProvider value={{ projects, posts }}>
				<Desktop />
			</ContentProvider>
		</>
	);
}
