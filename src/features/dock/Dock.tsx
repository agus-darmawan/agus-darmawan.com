"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { APPS, DOCK_MOBILE_LIMIT } from "@/config/apps";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { WindowState } from "@/types/app";
import { AppGrid } from "./AppGrid";
import { DockIcon } from "./DockIcon";
import { DockLauncher } from "./DockLauncher";

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
						{APPS.slice(0, DOCK_MOBILE_LIMIT).map((app) => {
							const win = windows.find((w) => w.appId === app.id);
							return (
								<DockIcon
									key={app.id}
									app={app}
									label={t(app.name)}
									isRunning={!!win}
									isActive={!!win && activeWindow === win.id}
									onClick={() => handleAppClick(app.id)}
								/>
							);
						})}
						{APPS.slice(DOCK_MOBILE_LIMIT).map((app) => {
							const win = windows.find((w) => w.appId === app.id);
							return (
								<DockIcon
									key={app.id}
									app={app}
									label={t(app.name)}
									isRunning={!!win}
									isActive={!!win && activeWindow === win.id}
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
