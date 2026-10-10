/**
 * Single source of truth for identity, URLs and social profiles.
 * Used by metadata, JSON-LD, sitemap, OG images and the GitHub content layer —
 * change it here, not in five different files.
 */
export const SITE = {
	url: (process.env.NEXT_PUBLIC_APP_URL ?? "https://agus-darmawan.com").replace(
		/\/$/,
		"",
	),
	name: "I Wayan Agus Darmawan",
	shortName: "Agus Darmawan",
	alternateNames: ["Agus Darmawan", "Wayan Agus Darmawan", "agus-darmawan"],
	jobTitle: "Full-Stack & Robotics Developer",
	email: "darmawandeveloper@gmail.com",
	location: { locality: "Denpasar", region: "Bali", country: "ID" },
	worksFor: { name: "PT Ezra Robotics Teknologi" },
	alumniOf: {
		name: "Institut Teknologi Sepuluh Nopember",
		url: "https://www.its.ac.id",
	},
	knowsAbout: [
		"Robotics",
		"ROS2",
		"Autonomous Navigation",
		"Computer Vision",
		"Next.js",
		"TypeScript",
		"Full-Stack Web Development",
	],
	twitterHandle: "@agusdarmawnn",
	/** Display label → URL. Also emitted as JSON-LD `sameAs`. */
	socials: {
		GitHub: "https://github.com/agus-darmawan",
		LinkedIn: "https://www.linkedin.com/in/agusdarmawnn/",
	},
	github: {
		username: "agus-darmawan",
		/** Public repos tagged with this topic are listed as projects automatically. */
		portfolioTopic: "portfolio",
	},
} as const;

export const absoluteUrl = (path = "/") =>
	`${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** The CV PDF for a locale, served from the content repo (null if unset). */
export function resumeUrl(locale: string): string | null {
	const base = process.env.NEXT_PUBLIC_CONTENT_URL?.replace(/\/$/, "");
	return base ? `${base}/resume/resume_${locale}.pdf` : null;
}
