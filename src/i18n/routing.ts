import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["en", "id"],

	// Used when no locale matches
	defaultLocale: "en",
});

/** Shared by server + client next-intl config (Bali, WITA). */
export const TIME_ZONE = "Asia/Makassar";

export type Locale = (typeof routing.locales)[number];

export const isLocale = (value: string): value is Locale =>
	(routing.locales as readonly string[]).includes(value);
