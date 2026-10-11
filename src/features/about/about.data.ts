/**
 * Data behind the About window and the /about page (the JSON-LD on that page
 * reads it too, so the structured data can never drift from what's shown).
 * Translatable text lives in messages/{locale}/about.json; keys end in `Key`.
 */

export const SKILL_GROUPS = [
	{
		labelKey: "skillsFrontend",
		color: "#e95420",
		skills: [
			"Swift",
			"SwiftUI",
			"React",
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
		],
	},
	{
		labelKey: "skillsBackend",
		color: "#3b82f6",
		skills: [
			"Node.js",
			"Express",
			"AdonisJS",
			"PostgreSQL",
			"Prisma",
			"Docker",
		],
	},
	{
		labelKey: "skillsRobotics",
		color: "#10b981",
		skills: [
			"ROS / ROS2",
			"Python",
			"C++",
			"OpenCV",
			"YOLO",
			"TensorFlow",
			"Gazebo",
			"ESP-IDF",
		],
	},
] as const;

export const EDUCATION = [
	{
		id: "its",
		institutionKey: "educationIts",
		degreeKey: "educationItsDegree",
		highlightKey: "educationItsHighlight",
		period: { start: "2021-07", end: "2025-09" },
		url: "https://www.its.ac.id",
		color: "#0ea5e9",
		achievementKeys: [
			"educationItsAchievement1",
			"educationItsAchievement2",
			"educationItsAchievement3",
		],
	},
	{
		id: "apple",
		institutionKey: "educationApple",
		degreeKey: "educationAppleDegree",
		highlightKey: "educationAppleHighlight",
		period: { start: "2025-02", end: "2025-12" },
		url: undefined,
		color: "#6366f1",
		achievementKeys: [
			"educationAppleAchievement1",
			"educationAppleAchievement2",
		],
	},
] as const;

export type AwardLevel = "international" | "national";

export const AWARDS: {
	title: string;
	event: string;
	level: AwardLevel;
	year: string;
	emoji: string;
	color: string;
}[] = [
	{
		title: "Grand Champion",
		event: "International Roboboat Competition (IRC) 2023",
		level: "international",
		year: "2023",
		emoji: "🏆",
		color: "#f59e0b",
	},
	{
		title: "1st Place — Paper Competition & Favorite Paper",
		event: "ICAVETS 2022",
		level: "international",
		year: "2022",
		emoji: "🥇",
		color: "#e95420",
	},
	{
		title: "2nd Place — Design Documentation",
		event: "International Roboboat Competition (IRC) 2023",
		level: "international",
		year: "2023",
		emoji: "🥈",
		color: "#6366f1",
	},
	{
		title: "1st Place — Unmanned Water Vessel",
		event: "KKI (Kontes Kapal Indonesia) 2022",
		level: "national",
		year: "2022",
		emoji: "🥇",
		color: "#10b981",
	},
	{
		title: "1st Place — Unmanned Water Vessel",
		event: "KKI (Kontes Kapal Indonesia) 2023",
		level: "national",
		year: "2023",
		emoji: "🥇",
		color: "#10b981",
	},
];

export const LEVEL_COLORS: Record<AwardLevel, string> = {
	international: "#e95420",
	national: "#0ea5e9",
};

export const PUBLICATIONS = [
	{
		id: "quadruped",
		titleKey: "publicationQuadruped",
		authorsKey: "publicationQuadrupedAuthors",
		venueKey: "publicationQuadrupedVenue",
		year: "2025",
		color: "#10b981",
		url: "https://ieeexplore.ieee.org/document/11137561/",
	},
	{
		id: "gesture",
		titleKey: "publicationGesture",
		authorsKey: "publicationGestureAuthors",
		venueKey: "publicationGestureVenue",
		year: "2024",
		color: "#8b5cf6",
		url: "https://repository.its.ac.id/123032/",
	},
] as const;
