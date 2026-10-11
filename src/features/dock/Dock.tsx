"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { APPS, DOCK_MOBILE_LIMIT } from "@/config/apps";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useWindowStore } from "@/store/useWindowStore";
import { AppGrid } from "./AppGrid";
import { DockIcon } from "./DockIcon";
import { DockLauncher } from "./DockLauncher";

export function Dock() {
	const [gridOpen, setGridOpen] = useState(false);
	const dockRef = useRef<HTMLDivElement>(null);
	const t = useTranslations("Dock");
	const runningApps = useWindowStore(
		useShallow((s) => s.windows.map((w) => w.appId)),
	);
	const handleDockClick = useWindowStore((s) => s.handleDockClick);
	const openWindow = useWindowStore((s) => s.openWindow);

	const closeGrid = useCallback(() => setGridOpen(false), []);
	useClickOutside(dockRef, closeGrid);

	// Dock icons toggle (open → minimize → restore); the app grid always
	// brings the app forward, like GNOME's overview.
	const launch = (appId: string) => {
		setGridOpen(false);
		handleDockClick(appId);
	};
	const launchFromGrid = (appId: string) => {
		setGridOpen(false);
		openWindow(appId);
	};

	return (
		<div ref={dockRef}>
			{/* The grid overlays the windows (they sit in a lower stacking
			    context), so opening it no longer minimizes everything. */}
			{gridOpen && (
				<AppGrid
					runningApps={runningApps}
					onAppClick={launchFromGrid}
					onClose={closeGrid}
				/>
			)}

			<nav
				aria-label={t("label")}
				className="fixed bottom-0 inset-x-0 h-16 flex items-end justify-center pointer-events-none z-40"
			>
				<div
					data-tour="dock"
					className="flex items-center gap-1 px-3 py-2 rounded-t-xl pointer-events-auto bg-[#111] border border-b-0 border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
				>
					<DockLauncher
						isOpen={gridOpen}
						onClick={() => setGridOpen((v) => !v)}
					/>

					<span
						aria-hidden
						className="w-px h-8 mx-1 rounded-full bg-white/10"
					/>

					<div className="flex items-center gap-1">
						{APPS.map((app, index) => (
							<DockIcon
								key={app.id}
								app={app}
								label={t(app.id)}
								isRunning={runningApps.includes(app.id)}
								onClick={() => launch(app.id)}
								className={
									index >= DOCK_MOBILE_LIMIT ? "hidden sm:flex" : undefined
								}
							/>
						))}
					</div>
				</div>
			</nav>
		</div>
	);
}
