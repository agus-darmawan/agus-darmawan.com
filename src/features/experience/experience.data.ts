/** `YYYY-MM`; formatted per locale at render time. */
type YearMonth = `${number}-${number}`;

export interface ExperienceRole {
	/** Key under `Experience.{company}.roles.{role}` in messages/{locale}/experience.json */
	i18nKey: string;
	period: { start: YearMonth; end: YearMonth | null };
	tech: string[];
}

export interface ExperienceEntry {
	/** Key under the `Experience` namespace, e.g. "ezraRobotics". */
	i18nKey: string;
	color: string;
	/**
	 * Optional logo in /public (e.g. "/companies/ezra-robotics.png"). Omitted
	 * entries render the company initial — the old paths all 404'd because
	 * /public/companies never existed.
	 */
	logo?: string;
	roles: ExperienceRole[];
}

export const EXPERIENCES: ExperienceEntry[] = [
	{
		i18nKey: "ezraRobotics",
		color: "#e95420",
		roles: [
			{
				i18nKey: "roboticsEngineer",
				period: { start: "2025-11", end: null },
				tech: [
					"ROS2",
					"Python",
					"C++",
					"YOLOv8",
					"RTK GPS",
					"LIO",
					"Deep Robotics X30",
				],
			},
			{
				i18nKey: "juniorRoboticsEngineer",
				period: { start: "2024-12", end: "2025-11" },
				tech: [
					"ROS2",
					"Python",
					"LiDAR",
					"Thermal Camera",
					"Next.js",
					"WebSocket",
				],
			},
		],
	},
	{
		i18nKey: "aseec",
		color: "#3b82f6",
		roles: [
			{
				i18nKey: "researchMentor",
				period: { start: "2023-04", end: "2026-03" },
				tech: [
					"IoT",
					"Machine Learning",
					"Embedded Systems",
					"Web Development",
				],
			},
		],
	},
	{
		i18nKey: "itsTeknoSains",
		color: "#10b981",
		roles: [
			{
				i18nKey: "roboticsSoftwareEngineer",
				period: { start: "2024-09", end: "2025-08" },
				tech: [
					"ROS Noetic",
					"DLIO",
					"Next.js",
					"rosbridge",
					"roslib.js",
					"PostgreSQL",
				],
			},
			{
				i18nKey: "roboticsEngineerAsv",
				period: { start: "2023-09", end: "2023-12" },
				tech: [
					"ROS Noetic",
					"GPS RTK",
					"IMU",
					"YOLOv8",
					"Pure Pursuit",
					"Python",
				],
			},
		],
	},
	{
		i18nKey: "b401Lab",
		color: "#8b5cf6",
		roles: [
			{
				i18nKey: "labAssistant",
				period: { start: "2024-06", end: "2025-08" },
				tech: [
					"ROS",
					"Gazebo",
					"Isaac Sim",
					"Webots",
					"TurtleBot",
					"UR5",
					"Python",
				],
			},
		],
	},
	{
		i18nKey: "barunastra",
		color: "#0ea5e9",
		roles: [
			{
				i18nKey: "divisionLeader",
				period: { start: "2023-12", end: "2024-11" },
				tech: [
					"ROS",
					"Electronics Design",
					"Sensor Integration",
					"C++",
					"Python",
				],
			},
			{
				i18nKey: "roboticsSoftwareEngineer",
				period: { start: "2022-04", end: "2023-12" },
				tech: [
					"ROS Noetic",
					"LiDAR",
					"GPS RTK",
					"IMU",
					"YOLO",
					"PID",
					"Python",
					"C++",
				],
			},
		],
	},
	{
		i18nKey: "satkomindo",
		color: "#f59e0b",
		roles: [
			{
				i18nKey: "fullStackDeveloper",
				period: { start: "2024-02", end: "2024-06" },
				tech: [
					"React",
					"AdonisJS",
					"TypeScript",
					"PostgreSQL",
					"Docker",
					"JWT",
					"RBAC",
				],
			},
		],
	},
	{
		i18nKey: "mage9",
		color: "#ec4899",
		roles: [
			{
				i18nKey: "frontendDeveloper",
				period: { start: "2023-01", end: "2024-02" },
				tech: ["Next.js", "Tailwind CSS", "TypeScript", "Firebase"],
			},
		],
	},
];
