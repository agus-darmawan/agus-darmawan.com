import { useTranslations } from "next-intl";
import { SITE } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { contentPath, listingPath } from "@/lib/content/paths";
import type { BlogMeta, ProjectMeta } from "@/lib/content/types";

/**
 * Server-rendered, text-only version of the portfolio.
 *
 * The desktop is a client-only app that renders nothing until hydration (and
 * then a boot animation), so the home page HTML used to contain zero words —
 * nothing for Google to rank for "Agus Darmawan" and nothing for screen
 * readers. This section mirrors the About/Projects/Blog windows as plain
 * semantic HTML: hidden visually, exposed to assistive tech, and revealed
 * when a keyboard user focuses the skip link.
 */
const NO_JS_STYLE =
	"#profile{position:static!important;width:auto!important;height:auto!important;margin:0!important;padding:2rem!important;overflow:visible!important;clip:auto!important;clip-path:none!important;white-space:normal!important}";

export function HomeProfile({
	projects,
	posts,
}: {
	projects: ProjectMeta[];
	posts: BlogMeta[];
}) {
	const t = useTranslations("Seo");
	const about = useTranslations("AboutWindow");

	return (
		<>
			{/* No-JS visitors (and crawlers that don't run JS) get the text version. */}
			<noscript>
				<style>{NO_JS_STYLE}</style>
			</noscript>
			<a
				href="#profile"
				className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-black"
			>
				{t("skipToProfile")}
			</a>

			<section
				id="profile"
				tabIndex={-1}
				aria-labelledby="profile-name"
				className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:inset-0 focus-within:z-[9999] focus-within:overflow-auto focus-within:bg-(--window-bg) focus-within:p-8 focus-within:text-(--text-primary)"
			>
				<h1 id="profile-name">
					{SITE.name} ({SITE.shortName}) — {about("role")}
				</h1>
				<p>{about("location")}</p>
				<p>{about("bio")}</p>
				<p>
					<Link href="/about">{t("aboutPageTitle")}</Link>
				</p>

				<h2>
					<Link href={listingPath("project")}>{t("projectsTitle")}</Link>
				</h2>
				<ul>
					{projects.map((p) => (
						<li key={p.slug}>
							<Link href={contentPath(p)}>{p.title}</Link> — {p.description}
						</li>
					))}
				</ul>

				{posts.length > 0 && (
					<>
						<h2>
							<Link href={listingPath("blog")}>{t("blogTitle")}</Link>
						</h2>
						<ul>
							{posts.map((p) => (
								<li key={p.slug}>
									<Link href={contentPath(p)}>{p.title}</Link> — {p.description}
								</li>
							))}
						</ul>
					</>
				)}

				<h2>{t("elsewhere")}</h2>
				<ul>
					{Object.entries(SITE.socials).map(([name, href]) => (
						<li key={name}>
							<a href={href} rel="me noopener" target="_blank">
								{name}
							</a>
						</li>
					))}
					<li>
						<a href={`mailto:${SITE.email}`}>{SITE.email}</a>
					</li>
				</ul>
			</section>
		</>
	);
}
