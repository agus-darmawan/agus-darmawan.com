import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Each locale has its messages split across multiple files.
// Add new files here as the project grows.
const MESSAGE_FILES = [
	"topbar",
	"dock",
	"about",
	"experience",
	"projects",
	"terminal-contact-resume",
] as const;

async function loadMessages(locale: string) {
	const chunks = await Promise.all(
		MESSAGE_FILES.map((file) =>
			import(`../../messages/${locale}/${file}.json`).then((m) => m.default),
		),
	);
	// Deep-merge: all top-level namespace keys are unique across files,
	// so a shallow Object.assign is sufficient.
	return Object.assign({}, ...chunks);
}

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale;

	return {
		locale,
		messages: await loadMessages(locale),
	};
});
