"use client";

import { AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { BootScreen } from "@/features/boot/BootScreen";
import { CommandPalette } from "@/features/command-palette/CommandPalette";
import { DesktopBackground } from "@/features/desktop/DesktopBackground";
import { Dock } from "@/features/dock/Dock";
import { OnboardingTour } from "@/features/onboarding/OnboardingTour";
import { Screensaver } from "@/features/screensaver/Screensaver";
import TopBar from "@/features/top-bar/TopBar";
import { useWindowDrag } from "@/features/window-manager/hooks/useWindowDrag";
import { SnapPreview } from "@/features/window-manager/SnapPreview";
import { WindowFrame } from "@/features/window-manager/WindowFrame";
import { getWindowComponent } from "@/features/window-manager/window.registry";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useWindowStore } from "@/store/useWindowStore";
import type { WindowState } from "@/types/app";

// ── Window Content ────────────────────────────────────────────────────────────

function WindowContent({ win }: { win: WindowState }) {
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

/** The interactive Ubuntu desktop (client-only shell). */
export function Desktop() {
	// ── Boot screen ──────────────────────────────────────────────────────────
	// Start as null (unknown) to avoid SSR/client mismatch
	// useEffect runs only on client — safe to read sessionStorage there
	const [booting, setBooting] = useState<boolean | null>(null);

	useEffect(() => {
		// Only runs on client — no SSR mismatch
		const hasBooted = sessionStorage.getItem("hasBooted");
		setBooting(!hasBooted);
	}, []);

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

	const { dragging, snapPreview, handleMouseDown } = useWindowDrag({
		getWindows: () => useWindowStore.getState().windows,
		onBringToFront: bringToFront,
		onPositionChange: useWindowStore.getState().updatePosition,
		onSnap: useWindowStore.getState().setSnapZone,
	});

	// ── Theme & locale for terminal commands ─────────────────────────────────

	const { setTheme } = useTheme();
	const router = useRouter();
	const pathname = usePathname();

	// ── Events ───────────────────────────────────────────────────────────────

	useEffect(() => {
		const handler = () => minimizeAllWindows();
		window.addEventListener("minimizeAllWindows", handler);
		return () => window.removeEventListener("minimizeAllWindows", handler);
	}, [minimizeAllWindows]);

	// Terminal → open app
	useEffect(() => {
		const handler = (e: CustomEvent) => openWindow(e.detail.appId);
		window.addEventListener("openApp", handler as EventListener);
		return () =>
			window.removeEventListener("openApp", handler as EventListener);
	}, [openWindow]);

	// Terminal → close active window
	// Use getState() to avoid re-registering on every focus change
	useEffect(() => {
		const handler = () => {
			const id = useWindowStore.getState().activeWindowId;
			if (id) useWindowStore.getState().closeWindow(id);
		};
		window.addEventListener("closeActiveWindow", handler);
		return () => window.removeEventListener("closeActiveWindow", handler);
	}, []);

	// Terminal → switch theme
	useEffect(() => {
		const handler = (e: CustomEvent) => setTheme(e.detail);
		window.addEventListener("setTheme", handler as EventListener);
		return () =>
			window.removeEventListener("setTheme", handler as EventListener);
	}, [setTheme]);

	// Terminal → switch locale
	// router and pathname are stable refs from next-intl — no need to add locale
	useEffect(() => {
		const handler = (e: CustomEvent) => {
			router.push(pathname, { locale: e.detail });
		};
		window.addEventListener("setLocale", handler as EventListener);
		return () =>
			window.removeEventListener("setLocale", handler as EventListener);
	}, [router, pathname]);

	// ── Render ────────────────────────────────────────────────────────────────

	// null = unknown (SSR / first paint) → render nothing to avoid flash
	if (booting === null) return null;

	// true = first visit this session → show boot screen
	if (booting) {
		return <BootScreen onDone={handleBootDone} />;
	}

	// false = already booted → show portfolio
	return (
		<main
			className="w-full h-screen overflow-hidden select-none"
			style={{ background: "#0d0010" }}
		>
			<DesktopBackground />
			<CommandPalette />
			<Screensaver />
			<TopBar />
			<OnboardingTour />

			<div className="relative h-[calc(100vh-4rem)] mt-8">
				<SnapPreview zone={snapPreview} />
				<AnimatePresence>
					{windows.map((win) => {
						return (
							<WindowFrame
								key={win.id}
								window={win}
								isActive={activeWindowId === win.id}
								isDragging={dragging === win.id}
								onMouseDown={(e) => handleMouseDown(e, win.id)}
								onClick={() => {
									setActiveWindow(win.id);
									bringToFront(win.id);
								}}
								onClose={() => closeWindow(win.id)}
								onMinimize={() => minimizeWindow(win.id)}
								onMaximize={() => toggleMaximize(win.id)}
							>
								<WindowContent win={win} />
							</WindowFrame>
						);
					})}
				</AnimatePresence>
			</div>

			<Dock
				windows={windows}
				activeWindow={activeWindowId}
				onIconClick={handleDockClick}
			/>
		</main>
	);
}
