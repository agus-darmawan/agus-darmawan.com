import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const MESSAGE_FILES = [
	"topbar",
	"dock",
	"about",
	"experience",
	"projects",
	"terminal-contact-resume",
	"blog", // ← tambah ini
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
		messages: await loadMessages(locale),
	};
});
