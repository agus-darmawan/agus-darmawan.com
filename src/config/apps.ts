import {
	BookOpen,
	Briefcase,
	FileText,
	Folder,
	type LucideIcon,
	Mail,
	Terminal,
	User,
} from "lucide-react";

export interface AppConfig {
	/** Window registry key and `Dock.<id>` translation key. */
	id: AppId;
	icon: LucideIcon;
	/** Tailwind background class for the icon tile. */
	color: string;
}

export const APP_IDS = [
	"about",
	"terminal",
	"resume",
	"experience",
	"projects",
	"blog",
	"contact",
] as const;

export type AppId = (typeof APP_IDS)[number];

export const isAppId = (value: string): value is AppId =>
	(APP_IDS as readonly string[]).includes(value);

export const APPS: AppConfig[] = [
	{ id: "about", icon: User, color: "bg-orange-500" },
	{ id: "terminal", icon: Terminal, color: "bg-[#300a24]" },
	{ id: "resume", icon: FileText, color: "bg-red-500" },
	{ id: "experience", icon: Briefcase, color: "bg-blue-600" },
	{ id: "projects", icon: Folder, color: "bg-teal-500" },
	{ id: "blog", icon: BookOpen, color: "bg-violet-500" },
	{ id: "contact", icon: Mail, color: "bg-purple-600" },
];

/** Apps shown in the dock on small screens; the rest live in the app grid. */
export const DOCK_MOBILE_LIMIT = 4;
