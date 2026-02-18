"use client";

import {
	Briefcase,
	FileText,
	Folder,
	Mail,
	Terminal,
	User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { AppConfig, WindowState } from "@/types/app";
import { AppGrid } from "./AppGrid";
import { DockIcon } from "./DockIcon";
import { DockLauncher } from "./DockLauncher";

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
	{ id: "contact", name: "contact", icon: Mail, color: "bg-yellow-600" },
];

interface DockProps {
	windows: WindowState[];
	activeWindow: string | null;
	onIconClick: (appId: string) => void;
}

export function Dock({ windows, activeWindow, onIconClick }: DockProps) {
	const [gridOpen, setGridOpen] = useState(false);
	const dockRef = useRef<HTMLDivElement>(null!);
	const t = useTranslations("Dock");

	useClickOutside({ ref: dockRef, onOutside: () => setGridOpen(false) });

	const handleAppClick = (appId: string) => {
		setGridOpen(false);
		onIconClick(appId);
	};

	const toggleGrid = () => {
		if (!gridOpen) {
			window.dispatchEvent(new CustomEvent("minimizeAllWindows"));
		}
		setGridOpen((v) => !v);
	};

	const MOBILE_LIMIT = 4;

	return (
		<div ref={dockRef}>
			{gridOpen && (
				<AppGrid
					apps={APPS}
					windows={windows}
					onAppClick={handleAppClick}
					onClose={() => setGridOpen(false)}
					t={t}
				/>
			)}

			<div className="fixed bottom-0 left-0 right-0 h-16 flex items-end justify-center pointer-events-none z-40">
				<div
					className="flex items-center gap-1 px-3 py-2 rounded-t-xl pointer-events-auto"
					style={{
						background: "#111111",
						borderTop: "1px solid rgba(255,255,255,0.1)",
						borderLeft: "1px solid rgba(255,255,255,0.1)",
						borderRight: "1px solid rgba(255,255,255,0.1)",
						boxShadow: "0 -4px 24px rgba(0,0,0,0.6)",
					}}
				>
					<DockLauncher isOpen={gridOpen} onClick={toggleGrid} />

					<div
						className="w-px h-8 mx-1 rounded-full"
						style={{ background: "rgba(255,255,255,0.1)" }}
						aria-hidden
					/>

					<div className="flex items-center gap-1">
						{APPS.slice(0, MOBILE_LIMIT).map((app) => {
							const win = windows.find((w) => w.appId === app.id);
							const isRunning = !!win;
							const isActive = !!win && activeWindow === win.id;
							return (
								<DockIcon
									key={app.id}
									app={app}
									label={t(app.name)}
									isRunning={isRunning}
									isActive={isActive}
									onClick={() => handleAppClick(app.id)}
								/>
							);
						})}
						{APPS.slice(MOBILE_LIMIT).map((app) => {
							const win = windows.find((w) => w.appId === app.id);
							const isRunning = !!win;
							const isActive = !!win && activeWindow === win.id;
							return (
								<DockIcon
									key={app.id}
									app={app}
									label={t(app.name)}
									isRunning={isRunning}
									isActive={isActive}
									onClick={() => handleAppClick(app.id)}
									className="hidden sm:flex"
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
