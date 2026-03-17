// src/config/apps.ts
import {
	BookOpen,
	Briefcase,
	FileText,
	Folder,
	Mail,
	Terminal,
	User,
} from "lucide-react";
import type { AppConfig } from "@/types/app";

export const APPS: AppConfig[] = [
	{ id: "about", name: "about", icon: User, color: "bg-orange-500" },
	{ id: "terminal", name: "terminal", icon: Terminal, color: "bg-[#300a24]" },
	{ id: "resume", name: "resume", icon: FileText, color: "bg-red-500" },
	{
		id: "experience",
		name: "experience",
		icon: Briefcase,
		color: "bg-blue-600",
	},
	{ id: "projects", name: "projects", icon: Folder, color: "bg-teal-500" },
	{ id: "blog", name: "blog", icon: BookOpen, color: "bg-violet-500" },
	{ id: "contact", name: "contact", icon: Mail, color: "bg-purple-600" },
];

export const DOCK_MOBILE_LIMIT = 4;
