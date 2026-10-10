"use client";

import { useLocale } from "next-intl";
import { useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export const isLocale = (value: string): value is Locale =>
	(routing.locales as readonly string[]).includes(value);

/**
 * Switch the UI language while staying on the current page. Shared by the
 * settings menu, the command palette and the terminal `lang` command, which
 * each used to carry their own copy (the terminal via a window event).
 */
export function useSwitchLocale() {
	const locale = useLocale() as Locale;
	const router = useRouter();
	const pathname = usePathname();

	const switchLocale = useCallback(
		(next?: Locale) => {
			const target = next ?? (locale === "en" ? "id" : "en");
			if (target !== locale) router.replace(pathname, { locale: target });
		},
		[locale, pathname, router],
	);

	return { locale, switchLocale };
}
