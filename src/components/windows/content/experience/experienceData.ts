export interface ExperienceRole {
	i18nKey: string; // key under Experience.{companyKey}.roles.{roleKey}
	period: { start: string; end: string | null };
	tech: string[];
}

export interface ExperienceEntry {
	i18nKey: string; // key under Experience namespace e.g. "ezraRobotics"
	color: string;
	logo: string;
	totalDuration: string; // display string e.g. "1 year 4 months"
	roles: ExperienceRole[];
}

export const EXPERIENCES: ExperienceEntry[] = [
	{
		i18nKey: "ezraRobotics",
		color: "#e95420",
		logo: "/companies/ezra-robotics.png",
		totalDuration: "1y 4m",
		roles: [
			{
				i18nKey: "roboticsEngineer",
				period: { start: "Nov 2025", end: null },
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
				period: { start: "Dec 2024", end: "Nov 2025" },
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
		logo: "/companies/aseec.png",
		totalDuration: "3y",
		roles: [
			{
				i18nKey: "researchMentor",
				period: { start: "Apr 2023", end: "Mar 2026" },
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
		logo: "/companies/its-tekno.png",
		totalDuration: "1y 8m",
		roles: [
			{
				i18nKey: "roboticsSoftwareEngineer",
				period: { start: "Sep 2024", end: "Aug 2025" },
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
				period: { start: "Sep 2023", end: "Dec 2023" },
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
		logo: "/companies/b401.png",
		totalDuration: "1y 3m",
		roles: [
			{
				i18nKey: "labAssistant",
				period: { start: "Jun 2024", end: "Aug 2025" },
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
		logo: "/companies/barunastra.png",
		totalDuration: "2y 8m",
		roles: [
			{
				i18nKey: "divisionLeader",
				period: { start: "Dec 2023", end: "Nov 2024" },
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
				period: { start: "Apr 2022", end: "Dec 2023" },
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
		logo: "/companies/satkomindo.png",
		totalDuration: "5m",
		roles: [
			{
				i18nKey: "fullStackDeveloper",
				period: { start: "Feb 2024", end: "Jun 2024" },
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
		logo: "/companies/mage9.png",
		totalDuration: "1y 2m",
		roles: [
			{
				i18nKey: "frontendDeveloper",
				period: { start: "Jan 2023", end: "Feb 2024" },
				tech: ["Next.js", "Tailwind CSS", "TypeScript", "Firebase"],
			},
		],
	},
];
