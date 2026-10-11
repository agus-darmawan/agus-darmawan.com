import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SkipLink } from "./SkipLink";

/** Frame of every classic-site page: skip link, header, content, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
	const t = useTranslations("Site");

	return (
		<div className="site flex min-h-dvh flex-col">
			<SkipLink target="content">{t("skipToContent")}</SkipLink>
			<SiteHeader />
			{/* scroll-mt: lands below the sticky header, not under it. */}
			<main
				id="content"
				tabIndex={-1}
				className="flex-1 scroll-mt-16 outline-none"
			>
				{children}
			</main>
			<SiteFooter />
		</div>
	);
}
