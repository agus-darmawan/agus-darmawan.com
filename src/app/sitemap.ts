import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://agus-darmawan.com";

export default function sitemap(): MetadataRoute.Sitemap {
	// Currently there's only one route per locale (the main desktop shell).
	// Once /blog/[slug] or /projects/[slug] become real routes (not just
	// windows inside the desktop), add them here — don't list URLs that
	// don't have a matching route yet, or Search Console will flag them
	// as errors.
	return routing.locales.map((locale) => ({
		url: `${BASE_URL}/${locale}`,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: locale === routing.defaultLocale ? 1 : 0.9,
	}));
}
