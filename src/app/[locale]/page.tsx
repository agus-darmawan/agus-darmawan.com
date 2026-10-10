import { setRequestLocale } from "next-intl/server";
import { ContentProvider } from "@/components/content/ContentProvider";
import { Desktop } from "@/features/desktop/Desktop";
import { getPosts, getProjects } from "@/lib/content";

// Re-generate hourly so GitHub stars / auto-discovered repos stay fresh.
export const revalidate = 3600;

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [projects, posts] = await Promise.all([
		getProjects(locale),
		getPosts(locale),
	]);

	return (
		<ContentProvider value={{ projects, posts }}>
			<Desktop />
		</ContentProvider>
	);
}
