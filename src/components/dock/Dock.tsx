"use client";

import {
	Briefcase,
	FileText,
	Folder,
	Mail,
	Terminal,
	User,
} from "lucide-react";
import type { AppConfig, WindowState } from "@/types/app";
import { DockIcon } from "./DockIcon";

const APPS: AppConfig[] = [
	{ id: "about", name: "About Me", icon: User, color: "bg-orange-500" },
	{ id: "terminal", name: "Terminal", icon: Terminal, color: "bg-[#300a24]" },
	{ id: "resume", name: "Resume", icon: FileText, color: "bg-red-500" },
	{
		id: "experience",
		name: "Experience",
		icon: Briefcase,
		color: "bg-blue-500",
	},
	{ id: "projects", name: "Projects", icon: Folder, color: "bg-teal-500" },
	{ id: "contact", name: "Contact", icon: Mail, color: "bg-yellow-600" },
];

interface DockProps {
	windows: WindowState[];
	activeWindow: string | null;
	onIconClick: (appId: string) => void;
}

export function Dock({ windows, activeWindow, onIconClick }: DockProps) {
	return (
		<div className="fixed bottom-0 left-0 right-0 h-16 flex items-end justify-center pointer-events-none z-50">
			<div className="bg-ubuntu-dark/95 backdrop-blur-md rounded-t-xl px-2 py-2 flex gap-1 shadow-2xl border-t border-white/10 pointer-events-auto">
				{APPS.map((app) => {
					const win = windows.find((w) => w.appId === app.id);
					const isOpen = !!win && !win.minimized;
					const isActive = !!win && activeWindow === win.id;

					return (
						<DockIcon
							key={app.id}
							name={app.name}
							Icon={app.icon}
							color={app.color}
							isOpen={isOpen}
							isActive={isActive}
							onClick={() => onIconClick(app.id)}
						/>
					);
				})}
			</div>
		</div>
	);
}
