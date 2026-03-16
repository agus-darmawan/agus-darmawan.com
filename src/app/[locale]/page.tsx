"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BootScreen } from "@/features/boot/BootScreen";
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
	// Boot screen — skip if already visited this session
	const [booting, setBooting] = useState(() => {
		if (typeof window === "undefined") return true;
		return !sessionStorage.getItem("hasBooted");
	});

	const handleBootDone = useCallback(() => {
		sessionStorage.setItem("hasBooted", "1");
		setBooting(false);
	}, []);

	// ── Store ────────────────────────────────────────────────────────────────

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

	const { dragging, handleMouseDown } = useWindowDrag({
		getWindows: () => useWindowStore.getState().windows,
		onBringToFront: bringToFront,
		onPositionChange: useWindowStore.getState().updatePosition,
	});

	// ── Events ──────────────────────────────────────────────────────────────

	// Minimize all (triggered by dock launcher)
	useEffect(() => {
		const handler = () => minimizeAllWindows();
		window.addEventListener("minimizeAllWindows", handler);
		return () => window.removeEventListener("minimizeAllWindows", handler);
	}, [minimizeAllWindows]);

	// Open README (dispatched by ProjectsWindow)
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

	// Terminal → UI: open app by appId
	useEffect(() => {
		const handler = (e: CustomEvent) => openWindow(e.detail.appId);
		window.addEventListener("openApp", handler as EventListener);
		return () =>
			window.removeEventListener("openApp", handler as EventListener);
	}, [openWindow]);

	// Terminal → UI: close active window
	useEffect(() => {
		const handler = () => {
			if (activeWindowId) closeWindow(activeWindowId);
		};
		window.addEventListener("closeActiveWindow", handler);
		return () => window.removeEventListener("closeActiveWindow", handler);
	}, [activeWindowId, closeWindow]);

	// ── Derived ─────────────────────────────────────────────────────────────

	const hasOpenReadme = useMemo(
		() => windows.some((w) => w.appId.startsWith("readme-") && !w.minimized),
		[windows],
	);

	// ── Handlers ────────────────────────────────────────────────────────────

	const handleClose = useCallback(
		(win: WindowState) => {
			const closeLocked = win.appId === "projects" && hasOpenReadme;
			if (closeLocked) {
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

	if (booting) {
		return <BootScreen onDone={handleBootDone} />;
	}

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
