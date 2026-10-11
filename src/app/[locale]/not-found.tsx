import { useTranslations } from "next-intl";
import { buttonClass } from "@/features/site/button";
import { Container } from "@/features/site/Container";
import { SiteShell } from "@/features/site/SiteShell";
import { Link } from "@/i18n/navigation";
import { listingPath } from "@/lib/content/paths";

/** Localized 404 (Next marks it noindex automatically). */
export default function NotFound() {
	const t = useTranslations("Seo");

	return (
		<SiteShell>
			<Container className="py-24 text-center">
				<p aria-hidden="true" className="text-6xl mb-4">
					🤖
				</p>
				<h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-light text-(--site-ink)">
					{t("notFoundTitle")}
				</h1>
				<p className="mt-3 text-(--site-muted)">{t("notFoundBody")}</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Link href="/" className={buttonClass("primary")}>
						{t("backHome")}
					</Link>
					<Link
						href={listingPath("project")}
						className={buttonClass("secondary")}
					>
						{t("projectsTitle")}
					</Link>
					<Link href={listingPath("blog")} className={buttonClass("secondary")}>
						{t("blogTitle")}
					</Link>
				</div>
			</Container>
		</SiteShell>
	);
}
