import { useTranslations } from "next-intl";
import { buttonClass } from "@/features/site/button";
import { Container } from "@/features/site/Container";
import { SiteShell } from "@/features/site/SiteShell";
import { DISPLAY_HEADING } from "@/features/site/typography";
import { Link } from "@/i18n/navigation";
import { listingPath } from "@/lib/content/paths";

/** Localized 404 (Next marks it noindex automatically). */
export default function NotFound() {
	const t = useTranslations("Seo");

	return (
		<SiteShell>
			<Container className="py-20 text-center">
				<p aria-hidden="true" className="mb-4 text-5xl">
					🤖
				</p>
				<h1 className={DISPLAY_HEADING}>{t("notFoundTitle")}</h1>
				<p className="mt-3 text-(--site-muted)">{t("notFoundBody")}</p>
				<div className="mt-7 flex flex-wrap justify-center gap-2.5">
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
