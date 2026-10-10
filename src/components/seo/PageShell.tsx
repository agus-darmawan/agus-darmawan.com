import { Monitor } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { SITE } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { listingPath } from "@/lib/content/paths";

interface Crumb {
	name: string;
	href: string;
}

/**
 * Layout for the crawlable standalone pages (/projects, /blog, details).
 * Plain, fast, readable HTML — the playful desktop is one click away.
 */
export function PageShell({
	path,
	breadcrumbs,
	children,
}: {
	/** Locale-less path of this page, used for the language switcher. */
	path: string;
	breadcrumbs: Crumb[];
	children: ReactNode;
}) {
	const t = useTranslations("Seo");
	const tc = useTranslations("Content");
	const locale = useLocale();

	return (
		<div className="min-h-screen bg-(--window-bg) text-(--text-primary)">
			<header className="sticky top-0 z-20 border-b border-(--border) bg-(--window-bg)/85 backdrop-blur">
				<div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 sm:px-6 h-14">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-sm whitespace-nowrap"
					>
						<span
							aria-hidden="true"
							className="w-6 h-6 rounded-full border-[3px] border-[#e95420] flex items-center justify-center"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-[#e95420]" />
						</span>
						{SITE.shortName}
					</Link>

					<nav className="flex items-center gap-1 text-xs sm:text-sm">
						<Link
							href={listingPath("project")}
							className="px-2 py-1 rounded-md hover:bg-(--surface-secondary)"
						>
							{t("projectsTitle")}
						</Link>
						<Link
							href={listingPath("blog")}
							className="px-2 py-1 rounded-md hover:bg-(--surface-secondary)"
						>
							{t("blogTitle")}
						</Link>
						<span className="mx-1 h-4 w-px bg-(--border)" aria-hidden="true" />
						{routing.locales.map((l) => (
							<Link
								key={l}
								href={path}
								locale={l}
								hrefLang={l}
								aria-current={l === locale ? "true" : undefined}
								className={
									l === locale
										? "px-1.5 py-1 font-semibold uppercase text-[#e95420]"
										: "px-1.5 py-1 uppercase text-(--text-muted) hover:text-(--text-primary)"
								}
							>
								{l}
							</Link>
						))}
					</nav>
				</div>
			</header>

			<div className="mx-auto max-w-4xl px-4 sm:px-6">
				<nav
					aria-label="Breadcrumb"
					className="pt-5 text-xs text-(--text-muted)"
				>
					<ol className="flex flex-wrap items-center gap-1.5">
						{breadcrumbs.map((c, i) => (
							<li key={c.href} className="flex items-center gap-1.5">
								{i > 0 && <span aria-hidden="true">/</span>}
								{i === breadcrumbs.length - 1 ? (
									<span aria-current="page" className="text-(--text-secondary)">
										{c.name}
									</span>
								) : (
									<Link href={c.href} className="hover:text-(--text-primary)">
										{c.name}
									</Link>
								)}
							</li>
						))}
					</ol>
				</nav>

				<main className="py-5">{children}</main>
			</div>

			<footer className="border-t border-(--border) mt-10">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-(--text-muted)">
					<p>
						© {new Date().getFullYear()} {SITE.name}
					</p>
					<ul className="flex items-center gap-3">
						{Object.entries(SITE.socials).map(([name, href]) => (
							<li key={name}>
								<a
									href={href}
									rel="me noopener noreferrer"
									target="_blank"
									className="hover:text-(--text-primary)"
								>
									{name}
								</a>
							</li>
						))}
						<li>
							<Link
								href="/"
								className="inline-flex items-center gap-1 rounded-md bg-[#e95420] px-2.5 py-1 font-medium text-white hover:opacity-90"
							>
								<Monitor size={12} aria-hidden="true" />
								{tc("openDesktop")}
							</Link>
						</li>
					</ul>
				</div>
			</footer>
		</div>
	);
}
