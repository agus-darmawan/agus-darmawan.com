import type { CSSProperties } from "react";
import type { SnapZone } from "@/types/app";

export const WINDOW_BASE_Z_INDEX = 100;
export const WINDOW_STAGGER = 36;
export const WINDOW_OFFSET_X = 100;
export const WINDOW_OFFSET_Y = 64;

/** Height of the top bar; windows live in a container that starts below it. */
export const TOP_BAR_HEIGHT = 32;
/** px from a screen edge that triggers a snap while dragging. */
export const SNAP_THRESHOLD = 48;
/** px the pointer must travel before a title-bar press becomes a drag. */
export const DRAG_THRESHOLD = 4;

/** Floating window size — keep in sync with `floatingWidth()`. */
export const FLOATING_SIZE = {
	width: "clamp(320px, 90vw, 900px)",
	height: "clamp(400px, 80vh, 650px)",
} as const;

export const floatingWidth = (viewportWidth: number) =>
	Math.min(900, Math.max(320, viewportWidth * 0.9));

/**
 * Geometry of snapped windows, relative to the windows container (which
 * already sits below the top bar). Shared by WindowFrame and SnapPreview so
 * the preview always matches where the window lands.
 */
export const SNAP_STYLES: Record<NonNullable<SnapZone>, CSSProperties> = {
	full: { top: 0, left: 0, width: "100%", height: "100%" },
	left: { top: 0, left: 0, width: "50%", height: "100%" },
	right: { top: 0, left: "50%", width: "50%", height: "100%" },
};

export const FALLBACK_TITLES: Record<string, string> = {
	about: "About Me",
	resume: "Resume",
	experience: "Experience",
	projects: "Projects",
	terminal: "Terminal",
	blog: "Blog",
	contact: "Contact",
};
