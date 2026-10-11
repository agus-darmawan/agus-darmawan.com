import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContentProvider } from "@/components/content/ContentProvider";
import { SITE } from "@/config/site";
import { Desktop } from "@/features/desktop/Desktop";
import { getPosts, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

// Re-generate hourly so GitHub stars / auto-discovered repos stay fresh.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Seo" });
	return {
		...pageMetadata({
			locale,
			path: "/desktop",
			title: t("desktopTitle"),
			description: t("desktopDescription"),
		}),
		// Same content as the website, which is the version search should show.
		robots: { index: false, follow: true },
	};
}

/** The interactive Ubuntu desktop: the portfolio's second, playful view. */
export default async function DesktopPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [projects, posts, t] = await Promise.all([
		getProjects(locale),
		getPosts(locale),
		getTranslations({ locale, namespace: "Seo" }),
	]);

	return (
		<ContentProvider value={{ projects, posts }}>
			<h1 className="sr-only">
				{t("desktopHeading", { name: SITE.shortName })}
			</h1>
			<noscript>
				<p className="fixed inset-0 grid place-content-center gap-3 bg-[#0d0010] p-8 text-center text-white/90">
					{t("desktopNoScript")}
					<a
						href={`/${locale}`}
						className="font-medium text-[#f47c4c] underline"
					>
						{t("desktopNoScriptLink")}
					</a>
				</p>
			</noscript>
			<Desktop />
		</ContentProvider>
	);
}
