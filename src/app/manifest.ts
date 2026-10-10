import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
	return {
		id: "/",
		name: `${SITE.shortName} — ${SITE.jobTitle}`,
		short_name: SITE.shortName,
		description: `${SITE.jobTitle} portfolio — an interactive Ubuntu desktop.`,
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#0d0010",
		theme_color: "#2c001e",
		icons: [
			{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	};
}
