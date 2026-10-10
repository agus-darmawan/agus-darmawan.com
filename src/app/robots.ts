import type { MetadataRoute } from "next";
import { absoluteUrl, SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			// /monitoring is the Sentry tunnel route.
			disallow: ["/api/", "/monitoring"],
		},
		sitemap: absoluteUrl("/sitemap.xml"),
		host: SITE.url,
	};
}
