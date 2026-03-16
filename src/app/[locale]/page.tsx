"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { Dock } from "@/features/dock/Dock";
import ReadmeWindow from "@/features/projects/readme/ReadmeWindow";
import TopBar from "@/features/top-bar/TopBar";
import { useWindowDrag } from "@/features/window-manager/hooks/useWindowDrag";
import { WindowFrame } from "@/features/window-manager/WindowFrame";
import { getWindowComponent } from "@/features/window-manager/window.registry";
import { useWindowStore } from "@/store/useWindowStore";
import type { WindowState } from "@/types/app";

// ── Window Content ────────────────────────────────────────────────────────────

function WindowContent({ win }: { win: WindowState }) {
	// README windows carry typed data
	if (win.appId.startsWith("readme-") && win.data?.kind === "readme") {
		return (
			<ReadmeWindow
				project={win.data.project}
				name={win.data.name}
				desc={win.data.desc}
				readmeFile={win.data.readmeFile}
			/>
		);
	}

	// All other windows via registry — lazy loaded
	const Component = getWindowComponent(win.appId);

	if (!Component) {
		return (
			<div
				className="h-full flex items-center justify-center text-sm"
				style={{ color: "var(--text-muted)" }}
			>
				Not found
			</div>
		);
	}

	return <Component />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IndexPage() {
	// Single store — no more manual sync between useAppStore + useWindowManager
	const windows = useWindowStore((s) => s.windows);
	const activeWindowId = useWindowStore((s) => s.activeWindowId);
	const openWindow = useWindowStore((s) => s.openWindow);
	const closeWindow = useWindowStore((s) => s.closeWindow);
	const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
	const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
	const bringToFront = useWindowStore((s) => s.bringToFront);
	const setActiveWindow = useWindowStore((s) => s.setActiveWindow);
	const handleDockClick = useWindowStore((s) => s.handleDockClick);
	const minimizeAllWindows = useWindowStore((s) => s.minimizeAllWindows);
	const getEffectiveZ = useWindowStore((s) => s.getEffectiveZ);

	// Drag — stays as hook because it needs mouse event listeners
	const { dragging, handleMouseDown } = useWindowDrag({
		getWindows: () => useWindowStore.getState().windows,
		onBringToFront: bringToFront,
		onPositionChange: useWindowStore.getState().updatePosition,
	});

	// ── Events ──────────────────────────────────────────────────────────────

	// Minimize all windows (triggered by dock launcher)
	useEffect(() => {
		const handler = () => minimizeAllWindows();
		window.addEventListener("minimizeAllWindows", handler);
		return () => window.removeEventListener("minimizeAllWindows", handler);
	}, [minimizeAllWindows]);

	// Open README window — dispatched by ProjectsWindow via custom event
	// This decouples ProjectsWindow from page.tsx (no more prop drilling onOpenReadme)
	useEffect(() => {
		const handler = (e: CustomEvent) => {
			const { project, name, desc, readmeFile } = e.detail;
			openWindow(`readme-${project.id}`, {
				kind: "readme",
				project,
				name,
				desc,
				readmeFile,
			});
		};

		window.addEventListener("openReadme", handler as EventListener);
		return () =>
			window.removeEventListener("openReadme", handler as EventListener);
	}, [openWindow]);

	// ── Derived ─────────────────────────────────────────────────────────────

	// True when at least one non-minimized README is open
	const hasOpenReadme = useMemo(
		() => windows.some((w) => w.appId.startsWith("readme-") && !w.minimized),
		[windows],
	);

	// ── Handlers ────────────────────────────────────────────────────────────

	const handleClose = useCallback(
		(win: WindowState) => {
			// Projects window is locked while any README is open
			const closeLocked = win.appId === "projects" && hasOpenReadme;

			if (closeLocked) {
				// Flash all open README windows to hint the user
				windows
					.filter((w) => w.appId.startsWith("readme-") && !w.minimized)
					.forEach((w) => bringToFront(w.id));
				return;
			}

			closeWindow(win.id);
		},
		[hasOpenReadme, windows, bringToFront, closeWindow],
	);

	// ── Render ───────────────────────────────────────────────────────────────

	return (
		<main className="w-full h-screen bg-ubuntu-purple overflow-hidden select-none">
			<TopBar />

			<div className="relative h-[calc(100vh-4rem)] mt-8">
				{windows.map((win) => {
					const closeLocked = win.appId === "projects" && hasOpenReadme;

					return (
						<WindowFrame
							key={win.id}
							window={{ ...win, zIndex: getEffectiveZ(win) }}
							isActive={activeWindowId === win.id}
							isDragging={dragging === win.id}
							onMouseDown={(e) => handleMouseDown(e, win.id)}
							onClick={() => {
								setActiveWindow(win.id);
								bringToFront(win.id);
							}}
							onClose={() => handleClose(win)}
							onMinimize={() => minimizeWindow(win.id)}
							onMaximize={() => toggleMaximize(win.id)}
							closeLocked={closeLocked}
						>
							<WindowContent win={win} />
						</WindowFrame>
					);
				})}
			</div>

			<Dock
				windows={windows}
				activeWindow={activeWindowId}
				onIconClick={handleDockClick}
			/>
		</main>
	);
}
