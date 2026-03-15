export type ProjectCategory = "web" | "robotics" | "research";

export interface ProjectMeta {
	id: string;
	i18nKey: string; // key in Projects namespace
	emoji: string;
	tech: string[];
	github: string;
	demo: string | null;
	stars: number;
	featured: boolean;
	category: ProjectCategory;
	color: string;
}

// Static metadata — content (name, desc, readme) comes from i18n
export const PROJECTS_META: ProjectMeta[] = [
	{
		id: "ubuntu-portfolio",
		i18nKey: "ubuntuPortfolio",
		emoji: "🖥️",
		tech: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Zustand",
			"TanStack Query",
			"next-intl",
		],
		github: "https://github.com/agus-darmawan/ubuntu-portfolio",
		demo: "https://agus-darmawan.com",
		stars: 48,
		featured: true,
		category: "web",
		color: "#e95420",
	},
	{
		id: "asv-navigation",
		i18nKey: "asvNavigation",
		emoji: "🚢",
		tech: ["ROS Noetic", "Python", "C++", "OpenCV", "YOLO", "GPS RTK", "LiDAR"],
		github: "https://github.com/agus-darmawan/barunastra-navigation",
		demo: null,
		stars: 34,
		featured: true,
		category: "robotics",
		color: "#0ea5e9",
	},
	{
		id: "quadruped-inspection",
		i18nKey: "quadrupedInspection",
		emoji: "🤖",
		tech: [
			"ROS2",
			"Python",
			"C++",
			"YOLOv8",
			"FLIR",
			"Deep Robotics X30",
			"LIO",
		],
		github: "https://github.com/agus-darmawan/quadruped-inspection",
		demo: null,
		stars: 27,
		featured: true,
		category: "robotics",
		color: "#10b981",
	},
	{
		id: "icar-monitoring",
		i18nKey: "icarMonitoring",
		emoji: "🚗",
		tech: [
			"Next.js",
			"TypeScript",
			"ROS Bridge",
			"roslib.js",
			"PostgreSQL",
			"Leaflet",
		],
		github: "https://github.com/agus-darmawan/icar-monitoring",
		demo: null,
		stars: 19,
		featured: false,
		category: "web",
		color: "#8b5cf6",
	},
	{
		id: "career-platform",
		i18nKey: "careerPlatform",
		emoji: "💼",
		tech: ["React", "AdonisJS", "TypeScript", "PostgreSQL", "Docker", "JWT"],
		github: "https://github.com/agus-darmawan/career-platform",
		demo: null,
		stars: 12,
		featured: false,
		category: "web",
		color: "#f59e0b",
	},
	{
		id: "hand-gesture-robot",
		i18nKey: "handGestureRobot",
		emoji: "✋",
		tech: [
			"Python",
			"TensorFlow Lite",
			"MediaPipe",
			"ROS2",
			"OpenCV",
			"NVIDIA Jetson",
		],
		github: "https://github.com/agus-darmawan/hand-gesture-cobot",
		demo: null,
		stars: 22,
		featured: true,
		category: "research",
		color: "#ec4899",
	},
];
