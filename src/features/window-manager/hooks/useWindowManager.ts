"use client";

import { useWindowDrag } from "./useWindowDrag";
import { useWindowLifecycle } from "./useWindowLifecycle";
import { useWindowZIndex } from "./useWindowZIndex";

type TranslateFn = (key: string) => string;

/**
 * Composes useWindowZIndex + useWindowLifecycle + useWindowDrag
 * into a single public API consumed by the page.
 */
export function useWindowManager(t?: TranslateFn) {
	const { nextZ } = useWindowZIndex();

	const {
		windows,
		activeWindow,
		windowsRef,
		setActiveWindow,
		bringToFront,
		updateWindowPosition,
		openWindow,
		closeWindow,
		minimizeWindow,
		toggleMaximize,
		minimizeAllWindows,
		handleDockClick,
	} = useWindowLifecycle({ t, nextZ });

	const { dragging, handleMouseDown } = useWindowDrag({
		windowsRef,
		onBringToFront: bringToFront,
		onPositionChange: updateWindowPosition,
	});

	return {
		windows,
		activeWindow,
		dragging,
		openWindow,
		closeWindow,
		minimizeWindow,
		minimizeAllWindows,
		toggleMaximize,
		handleDockClick,
		handleMouseDown,
		bringToFront,
		setActiveWindow,
	};
}
