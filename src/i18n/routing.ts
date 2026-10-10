import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["en", "id"],

	// Used when no locale matches
	defaultLocale: "en",
});

/** Shared by server + client next-intl config (Bali, WITA). */
export const TIME_ZONE = "Asia/Makassar";
