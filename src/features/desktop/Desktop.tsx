"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { BootScreen } from "@/features/boot/BootScreen";
import { CommandPalette } from "@/features/command-palette/CommandPalette";
import { DesktopBackground } from "@/features/desktop/DesktopBackground";
import { useDeepLink } from "@/features/desktop/useDeepLink";
import { Dock } from "@/features/dock/Dock";
import { OnboardingTour } from "@/features/onboarding/OnboardingTour";
import { Screensaver } from "@/features/screensaver/Screensaver";
import TopBar from "@/features/top-bar/TopBar";
import { useWindowDrag } from "@/features/window-manager/hooks/useWindowDrag";
import { SnapPreview } from "@/features/window-manager/SnapPreview";
import { WindowFrame } from "@/features/window-manager/WindowFrame";
import { storage } from "@/lib/storage";
import { useWindowStore } from "@/store/useWindowStore";
import type { SnapZone } from "@/types/app";

const BOOTED_KEY = "hasBooted";

// Module-level so the drag hook's handlers are created once.
const dragCallbacks = {
	getWindows: () => useWindowStore.getState().windows,
	onBringToFront: (id: string) => useWindowStore.getState().focusWindow(id),
	onPositionChange: (id: string, x: number, y: number) =>
		useWindowStore.getState().updatePosition(id, x, y),
	onSnap: (id: string, zone: SnapZone) =>
		useWindowStore.getState().setSnapZone(id, zone),
};

/** The interactive Ubuntu desktop (client-only shell). */
export function Desktop() {
	// null = not known yet (SSR / first paint): render nothing to avoid a flash.
	const [booting, setBooting] = useState<boolean | null>(null);
	useDeepLink();

	useEffect(() => {
		setBooting(!storage.get("session", BOOTED_KEY));
	}, []);

	const handleBootDone = useCallback(() => {
		storage.set("session", BOOTED_KEY, "1");
		setBooting(false);
	}, []);

	// Only the id list: a window moving must not re-render the desktop.
	const windowIds = useWindowStore(
		useShallow((s) => s.windows.map((w) => w.id)),
	);
	const { dragging, snapPreview, handleMouseDown } =
		useWindowDrag(dragCallbacks);

	if (booting === null) return null;
	if (booting) return <BootScreen onDone={handleBootDone} />;

	return (
		<main className="relative w-full h-dvh overflow-hidden bg-[#0d0010]">
			<DesktopBackground />
			<TopBar />

			{/*
			 * `isolate` makes the window area its own stacking context: window
			 * z-indices only order windows among themselves and can never cover
			 * the top bar menus, the dock or the dialogs. It ends above the dock.
			 */}
			<div className="absolute inset-x-0 top-8 bottom-18 isolate">
				<SnapPreview zone={snapPreview} />
				<AnimatePresence>
					{windowIds.map((id) => (
						<WindowFrame
							key={id}
							id={id}
							isDragging={dragging === id}
							onTitleBarMouseDown={handleMouseDown}
						/>
					))}
				</AnimatePresence>
			</div>

			<Dock />
			<CommandPalette />
			<Screensaver />
			<OnboardingTour />
		</main>
	);
}
