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
		setGridOpen(false); // Close grid FIRST
		onIconClick(appId);
	};

	const handleLauncherClick = () => {
		setGridOpen((v) => {
			const willOpen = !v;
			// If opening grid, signal to parent to minimize all windows
			if (willOpen) {
				// Emit custom event for parent to handle
				window.dispatchEvent(new CustomEvent("minimizeAllWindows"));
			}
			return willOpen;
		});
	};

	// On mobile, only show first 4 apps in dock
	const MOBILE_LIMIT = 4;
	const visibleApps = APPS.slice(0, MOBILE_LIMIT);

	return (
		<>
			{/* App grid overlay */}
			{gridOpen && (
				<AppGrid
					apps={APPS}
					windows={windows}
					onAppClick={handleAppClick}
					onClose={() => setGridOpen(false)}
					t={t}
				/>
			)}

			{/* Dock bar */}
			<div
				className="fixed bottom-0 left-0 right-0 h-16 flex items-end justify-center pointer-events-none z-40"
				ref={dockRef}
			>
				<div
					className="flex items-center gap-1 px-3 py-2 rounded-t-xl shadow-2xl pointer-events-auto border-t border-x"
					style={{
						background: "var(--dock-bg)",
						borderColor: "var(--dock-border)",
						backdropFilter: "blur(16px)",
						WebkitBackdropFilter: "blur(16px)",
					}}
				>
					{/* Ubuntu dash/launcher icon */}
					<DockLauncher isOpen={gridOpen} onClick={handleLauncherClick} />

					{/* Separator */}
					<div
						className="w-px h-8 mx-1 rounded-full"
						style={{ background: "var(--dock-border)" }}
						aria-hidden
					/>

					{/* App icons - limited on mobile, full on desktop */}
					<div className="flex items-center gap-1">
						{/* Mobile: first 4 apps */}
						{visibleApps.map((app) => {
							const win = windows.find((w) => w.appId === app.id);
							const isOpen = !!win && !win.minimized;
							const isActive = !!win && activeWindow === win.id;

							return (
								<DockIcon
									key={app.id}
									app={app}
									label={t(app.name)}
									isOpen={isOpen}
									isActive={isActive}
									onClick={() => handleAppClick(app.id)}
								/>
							);
						})}

						{/* Desktop: all remaining apps (hidden on mobile) */}
						{APPS.slice(MOBILE_LIMIT).map((app) => {
							const win = windows.find((w) => w.appId === app.id);
							const isOpen = !!win && !win.minimized;
							const isActive = !!win && activeWindow === win.id;

							return (
								<DockIcon
									key={app.id}
									app={app}
									label={t(app.name)}
									isOpen={isOpen}
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
