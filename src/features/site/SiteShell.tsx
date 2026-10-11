import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Frame of every classic-site page: skip link, header, content, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
	const t = useTranslations("Site");

	return (
		<div className="site flex min-h-dvh flex-col">
			<a
				href="#content"
				className="sr-only rounded-lg bg-(--site-primary) px-4 py-2 text-sm font-medium text-(--site-on-primary) focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50"
			>
				{t("skipToContent")}
			</a>
			<SiteHeader />
			<main id="content" tabIndex={-1} className="flex-1 outline-none">
				{children}
			</main>
			<SiteFooter />
		</div>
	);
}
