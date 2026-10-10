"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { type CSSProperties, type MouseEvent, memo } from "react";
import { FLOATING_SIZE, SNAP_STYLES } from "@/constants/window";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useWindowStore } from "@/store/useWindowStore";
import type { WindowState } from "@/types/app";
import { WindowErrorBoundary } from "./WindowErrorBoundary";
import { WindowHeader } from "./WindowHeader";
import { getWindowComponent } from "./window.registry";

const spring = {
	type: "spring",
	stiffness: 400,
	damping: 30,
	mass: 0.8,
} as const;

// Minimized windows stay mounted (hidden) so a terminal session, a half
// written contact message or a scrolled PDF survive minimize/restore.
const VARIANTS: Variants = {
	initial: { opacity: 0, scale: 0.94, y: 8 },
	open: {
		opacity: 1,
		scale: 1,
		y: 0,
		visibility: "visible",
		transition: spring,
	},
	minimized: {
		opacity: 0,
		scale: 0.9,
		y: 40,
		transition: { duration: 0.15, ease: "easeIn" },
		transitionEnd: { visibility: "hidden" },
	},
	exit: {
		opacity: 0,
		scale: 0.94,
		y: 8,
		transition: { duration: 0.15, ease: "easeIn" },
	},
};

const REDUCED_VARIANTS: Variants = {
	initial: { opacity: 0 },
	open: { opacity: 1, visibility: "visible", transition: { duration: 0.1 } },
	minimized: {
		opacity: 0,
		transition: { duration: 0.1 },
		transitionEnd: { visibility: "hidden" },
	},
	exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** The app inside a window. Memoized: dragging must not re-render content. */
const WindowContent = memo(function WindowContent({
	appId,
}: {
	appId: string;
}) {
	const t = useTranslations("Window");
	const App = getWindowComponent(appId);

	if (!App) {
		return (
			<div className="h-full flex items-center justify-center text-sm text-(--text-muted)">
				{t("notFound")}
			</div>
		);
	}
	return <App />;
});

function positionOf(win: WindowState, fullscreen: boolean): CSSProperties {
	if (fullscreen) return SNAP_STYLES.full;
	if (win.snapZone) return SNAP_STYLES[win.snapZone];
	return { top: win.position.y, left: win.position.x, ...FLOATING_SIZE };
}

interface WindowFrameProps {
	id: string;
	isDragging: boolean;
	onTitleBarMouseDown: (e: MouseEvent, id: string) => void;
}

/**
 * One window. It subscribes to its own slice of the store, so moving or
 * focusing a window re-renders that window only — not every open app.
 */
export const WindowFrame = memo(function WindowFrame({
	id,
	isDragging,
	onTitleBarMouseDown,
}: WindowFrameProps) {
	const win = useWindowStore((s) => s.windows.find((w) => w.id === id));
	const isActive = useWindowStore((s) => s.activeWindowId === id);
	const { focusWindow, closeWindow, minimizeWindow, toggleMaximize } =
		useWindowStore.getState();
	const tApps = useTranslations("Dock");
	const tWindow = useTranslations("Window");
	const isMobile = useIsMobile();
	const reduced = useReducedMotion();

	if (!win) return null;

	const fullscreen = win.maximized || win.snapZone === "full" || isMobile;
	const title = tApps.has(win.appId) ? tApps(win.appId) : win.appId;

	return (
		<motion.section
			aria-label={title}
			aria-hidden={win.minimized || undefined}
			inert={win.minimized || undefined}
			variants={reduced ? REDUCED_VARIANTS : VARIANTS}
			initial="initial"
			animate={win.minimized ? "minimized" : "open"}
			exit="exit"
			// Direct positional control while dragging — no spring lag.
			transition={isDragging ? { duration: 0 } : undefined}
			className={cn(
				"absolute overflow-hidden flex flex-col",
				isMobile ? "rounded-none" : "rounded-lg",
				isDragging && "cursor-grabbing select-none",
				isActive ? "shadow-ubuntu-lg" : "shadow-ubuntu",
			)}
			style={{ ...positionOf(win, fullscreen), zIndex: win.zIndex }}
			onMouseDownCapture={() => focusWindow(id)}
			onFocusCapture={() => focusWindow(id)}
			onMouseDown={(e) => onTitleBarMouseDown(e, id)}
		>
			<WindowHeader
				title={title}
				isActive={isActive}
				isMaximized={fullscreen}
				isMobile={isMobile}
				onClose={() => closeWindow(id)}
				onMinimize={() => minimizeWindow(id)}
				onMaximize={() => toggleMaximize(id)}
			/>

			<div className="flex-1 overflow-auto bg-(--window-bg) text-(--text-primary)">
				<WindowErrorBoundary
					appId={win.appId}
					title={tWindow("crashed")}
					retryLabel={tWindow("retry")}
				>
					<WindowContent appId={win.appId} />
				</WindowErrorBoundary>
			</div>
		</motion.section>
	);
});
