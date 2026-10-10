import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing, TIME_ZONE } from "./routing";

const MESSAGE_FILES = [
	"topbar",
	"dock",
	"about",
	"experience",
	"projects",
	"terminal-contact-resume",
	"blog",
	"onboarding",
	"content",
	"seo",
] as const;

async function loadMessages(locale: string) {
	const chunks = await Promise.all(
		MESSAGE_FILES.map((file) =>
			import(`../../messages/${locale}/${file}.json`).then((m) => m.default),
		),
	);
	return Object.assign({}, ...chunks);
}

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale;

	return {
		locale,
		// Explicit zone avoids SSR/CSR markup mismatches (and the
		// ENVIRONMENT_FALLBACK warning) when ICU messages format dates.
		timeZone: TIME_ZONE,
		messages: await loadMessages(locale),
	};
});
