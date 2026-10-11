import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { resumeUrl, SITE } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { LocaleSwitch } from "./LocaleSwitch";
import { SITE_NAV } from "./nav";
import { SiteLogo } from "./SiteLogo";
import { ThemeToggle } from "./ThemeToggle";
import { ViewSwitch } from "./ViewSwitch";

const SOURCE_URL = `https://github.com/${SITE.github.username}/agus-darmawan.com`;

const LINK =
	"text-(--site-text) transition-colors hover:text-(--site-ink) hover:underline decoration-ubuntu-orange underline-offset-4";

function FooterColumn({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div>
			<h2 className="text-[0.95rem] font-medium text-(--site-ink)">{title}</h2>
			<ul className="mt-4 space-y-2.5">{children}</ul>
		</div>
	);
}

export function SiteFooter() {
	const t = useTranslations("Site");
	const locale = useLocale();
	const cv = resumeUrl(locale);

	const elsewhere = [
		{ label: "GitHub", href: SITE.socials.GitHub },
		{ label: "LinkedIn", href: SITE.socials.LinkedIn },
		...(cv ? [{ label: t("footer.cv"), href: cv }] : []),
	];

	return (
		<footer className="border-t border-(--site-line) bg-(--site-raised)/50">
			<Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
				<div className="col-span-2 lg:col-span-1">
					<SiteLogo />
					<p className="mt-4 max-w-[32ch] leading-relaxed text-(--site-muted)">
						{t("footer.tagline")}
					</p>
					<a
						href={`mailto:${SITE.email}`}
						className="mt-4 inline-block break-all text-(--site-link) underline-offset-4 hover:underline"
					>
						{SITE.email}
					</a>
				</div>

				<FooterColumn title={t("footer.pages")}>
					<li>
						<Link href="/" className={LINK}>
							{t("home")}
						</Link>
					</li>
					{SITE_NAV.map(({ href, key }) => (
						<li key={href}>
							<Link href={href} className={LINK}>
								{t(`nav.${key}`)}
							</Link>
						</li>
					))}
				</FooterColumn>

				<FooterColumn title={t("footer.elsewhere")}>
					{elsewhere.map(({ label, href }) => (
						<li key={href}>
							<a
								href={href}
								target="_blank"
								rel="me noopener noreferrer"
								className={LINK}
							>
								{label}
							</a>
						</li>
					))}
				</FooterColumn>

				<div className="col-span-2 lg:col-span-1">
					<h2 className="text-[0.95rem] font-medium text-(--site-ink)">
						{t("footer.preferences")}
					</h2>
					<dl className="mt-3 space-y-2">
						<div className="flex items-center justify-between gap-4">
							<dt className="text-(--site-muted)">{t("language")}</dt>
							<dd>
								<LocaleSwitch className="-mr-2" />
							</dd>
						</div>
						<div className="flex items-center justify-between gap-4">
							<dt className="text-(--site-muted)">{t("theme.label")}</dt>
							<dd>
								<ThemeToggle withLabel className="-mr-2.5" />
							</dd>
						</div>
						<div className="flex items-center justify-between gap-4">
							<dt className="text-(--site-muted)">{t("footer.view")}</dt>
							<dd>
								<ViewSwitch />
							</dd>
						</div>
					</dl>
				</div>
			</Container>

			<Container>
				<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-(--site-line) py-6 text-sm text-(--site-muted)">
					<p>
						{t("footer.copyright", {
							year: new Date().getFullYear(),
							name: SITE.name,
						})}
					</p>
					<a
						href={SOURCE_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-(--site-ink)"
					>
						{t("footer.source")}
					</a>
				</div>
			</Container>
		</footer>
	);
}
