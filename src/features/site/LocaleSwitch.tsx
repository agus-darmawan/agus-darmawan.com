"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** EN / ID links to the same page in the other language. */
export function LocaleSwitch({ className }: { className?: string }) {
	const t = useTranslations("Site");
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<nav
			aria-label={t("language")}
			className={cn("flex items-center", className)}
		>
			{routing.locales.map((code) => {
				const current = code === locale;
				return (
					<Link
						key={code}
						href={pathname}
						locale={code}
						hrefLang={code}
						aria-current={current ? "true" : undefined}
						className={cn(
							"rounded-md px-1.5 py-1 text-[0.8125rem] uppercase transition-colors",
							current
								? "font-medium text-(--site-ink)"
								: "text-(--site-muted) hover:text-(--site-ink)",
						)}
					>
						{code}
					</Link>
				);
			})}
		</nav>
	);
}
