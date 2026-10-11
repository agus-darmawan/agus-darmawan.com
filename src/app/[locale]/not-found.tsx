import { useTranslations } from "next-intl";
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
				<h1 className="text-2xl font-bold">{t("notFoundTitle")}</h1>
				<p className="mt-2 text-sm text-(--text-secondary)">
					{t("notFoundBody")}
				</p>
				<div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
					<Link
						href="/"
						className="rounded-lg bg-[#e95420] px-3 py-1.5 font-medium text-white hover:opacity-90"
					>
						{t("backHome")}
					</Link>
					<Link
						href={listingPath("project")}
						className="rounded-lg border border-(--border) px-3 py-1.5 hover:border-[#e95420]"
					>
						{t("projectsTitle")}
					</Link>
					<Link
						href={listingPath("blog")}
						className="rounded-lg border border-(--border) px-3 py-1.5 hover:border-[#e95420]"
					>
						{t("blogTitle")}
					</Link>
				</div>
			</Container>
		</SiteShell>
	);
}
