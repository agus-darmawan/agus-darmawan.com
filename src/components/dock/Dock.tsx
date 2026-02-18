"use client";

import {
	Briefcase,
	FileText,
	Folder,
	Grid3x3,
	Mail,
	Terminal,
	User,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { AppConfig, WindowState } from "@/types/app";
import { AppGrid } from "./AppGrid";
import { DockIcon } from "./DockIcon";

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

	// Single handler used by BOTH dock icons and app grid buttons
	const handleAppClick = (appId: string) => {
		setGridOpen(false);
		onIconClick(appId);
	};

	const toggleGrid = () => {
		if (!gridOpen) {
			// Opening grid: minimize all windows first
			window.dispatchEvent(new CustomEvent("minimizeAllWindows"));
		}
		setGridOpen((v) => !v);
	};

	const MOBILE_LIMIT = 4;

	return (
		<>
			{gridOpen && (
				<AppGrid
					apps={APPS}
					windows={windows}
					onAppClick={handleAppClick}
					onClose={() => setGridOpen(false)}
					t={t}
				/>
			)}

			<div
				className="fixed bottom-0 left-0 right-0 h-16 flex items-end justify-center pointer-events-none z-40"
				ref={dockRef}
			>
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
					{/* Grid launcher button */}
					<button
						type="button"
						onClick={toggleGrid}
						aria-label="Show all applications"
						className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150 group"
						style={{
							background: gridOpen ? "#e95420" : "rgba(255,255,255,0.08)",
						}}
						onMouseEnter={(e) => {
							if (!gridOpen)
								(e.currentTarget as HTMLElement).style.background =
									"rgba(255,255,255,0.15)";
						}}
						onMouseLeave={(e) => {
							if (!gridOpen)
								(e.currentTarget as HTMLElement).style.background =
									"rgba(255,255,255,0.08)";
						}}
					>
						{gridOpen ? (
							<X size={18} className="text-white" />
						) : (
							<Grid3x3 size={20} className="text-white/75" />
						)}
						<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap bg-black text-white border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
							{gridOpen ? "Close" : "Show Apps"}
						</span>
					</button>

					<div
						className="w-px h-8 mx-1 rounded-full"
						style={{ background: "rgba(255,255,255,0.1)" }}
						aria-hidden
					/>

					{/* App icons */}
					<div className="flex items-center gap-1">
						{APPS.slice(0, MOBILE_LIMIT).map((app) => {
							const win = windows.find((w) => w.appId === app.id);
							// isRunning: window EXISTS (not closed), dot shows even when minimized
							const isRunning = !!win;
							// isActive: window is focused right now
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
		</>
	);
}
