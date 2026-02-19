import { useCallback, useEffect, useRef, useState } from "react";
import {
	FALLBACK_TITLES,
	WINDOW_OFFSET_X,
	WINDOW_OFFSET_Y,
	WINDOW_STAGGER,
} from "@/constants/window";
import type { WindowPayload, WindowState } from "@/types/app";

type TranslateFn = (key: string) => string;

interface UseWindowLifecycleOptions {
	t?: TranslateFn;
	nextZ: () => number;
}

/**
 * Manages window open/close/minimize/maximize state and dock-click logic.
 * Uses refs to avoid stale closures in event-driven callbacks.
 */
export function useWindowLifecycle({ t, nextZ }: UseWindowLifecycleOptions) {
	const [windows, setWindows] = useState<WindowState[]>([]);
	const [activeWindow, setActiveWindow] = useState<string | null>(null);

	// Refs always hold latest values — prevents stale closure bugs
	const windowsRef = useRef<WindowState[]>([]);
	const activeWindowRef = useRef<string | null>(null);

	useEffect(() => {
		windowsRef.current = windows;
	}, [windows]);

	useEffect(() => {
		activeWindowRef.current = activeWindow;
	}, [activeWindow]);

	const getTitle = useCallback(
		(appId: string) => {
			try {
				return t ? t(appId) : (FALLBACK_TITLES[appId] ?? appId);
			} catch {
				return FALLBACK_TITLES[appId] ?? appId;
			}
		},
		[t],
	);

	const bringToFront = useCallback(
		(id: string) => {
			const z = nextZ();
			setWindows((prev) =>
				prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
			);
			setActiveWindow(id);
		},
		[nextZ],
	);

	const updateWindowPosition = useCallback(
		(id: string, x: number, y: number) => {
			setWindows((prev) =>
				prev.map((w) => (w.id === id ? { ...w, position: { x, y } } : w)),
			);
		},
		[],
	);

	const openWindow = useCallback(
		(appId: string, data?: WindowPayload) => {
			const existing = windowsRef.current.find((w) => w.appId === appId);

			if (existing) {
				const z = nextZ();
				setWindows((prev) =>
					prev.map((w) =>
						w.id === existing.id
							? { ...w, minimized: false, data, zIndex: z }
							: w,
					),
				);
				setActiveWindow(existing.id);
				return;
			}

			const id = `${appId}-${Date.now()}`;
			const z = nextZ();
			const visibleCount = windowsRef.current.filter(
				(w) => !w.minimized,
			).length;

			const newWindow: WindowState = {
				id,
				appId,
				title: getTitle(appId),
				data,
				minimized: false,
				maximized: false,
				position: {
					x: WINDOW_OFFSET_X + visibleCount * WINDOW_STAGGER,
					y: WINDOW_OFFSET_Y + visibleCount * WINDOW_STAGGER,
				},
				zIndex: z,
			};

			setWindows((prev) => [...prev, newWindow]);
			setActiveWindow(id);
		},
		[nextZ, getTitle],
	);

	const closeWindow = useCallback((id: string) => {
		setWindows((prev) => prev.filter((w) => w.id !== id));
		setActiveWindow((prev) => (prev === id ? null : prev));
	}, []);

	const minimizeWindow = useCallback((id: string) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
		);
		setActiveWindow((prev) => (prev === id ? null : prev));
	}, []);

	const toggleMaximize = useCallback((id: string) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
		);
	}, []);

	const minimizeAllWindows = useCallback(() => {
		setWindows((prev) => prev.map((w) => ({ ...w, minimized: true })));
		setActiveWindow(null);
	}, []);

	const handleDockClick = useCallback(
		(appId: string) => {
			const win = windowsRef.current.find((w) => w.appId === appId);

			// Case 1: no window exists yet → open fresh
			if (!win) {
				openWindow(appId);
				return;
			}

			// Case 2: window is minimized → restore
			if (win.minimized) {
				const z = nextZ();
				setWindows((prev) =>
					prev.map((w) =>
						w.id === win.id ? { ...w, minimized: false, zIndex: z } : w,
					),
				);
				setActiveWindow(win.id);
				return;
			}

			// Case 3: window is focused → minimize (toggle behavior)
			if (activeWindowRef.current === win.id) {
				setWindows((prev) =>
					prev.map((w) => (w.id === win.id ? { ...w, minimized: true } : w)),
				);
				setActiveWindow(null);
				return;
			}

			// Case 4: window exists but not focused → bring to front
			const z = nextZ();
			setWindows((prev) =>
				prev.map((w) => (w.id === win.id ? { ...w, zIndex: z } : w)),
			);
			setActiveWindow(win.id);
		},
		[nextZ, openWindow],
	);

	return {
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
	};
}
