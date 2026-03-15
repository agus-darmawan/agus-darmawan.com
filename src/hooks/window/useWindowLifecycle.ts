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

function getIsMobile() {
	if (typeof window === "undefined") return false;
	return window.innerWidth < 768;
}

function deriveTitle(
	appId: string,
	data: WindowPayload,
	t?: TranslateFn,
): string {
	// README windows carry their name in data
	if (appId.startsWith("readme-") && data) {
		const d = data as { name?: string; project?: { emoji?: string } };
		const emoji = d.project?.emoji ?? "📄";
		const name = d.name ?? "README";
		return `${emoji} ${name}`;
	}
	try {
		return t ? t(appId) : (FALLBACK_TITLES[appId] ?? appId);
	} catch {
		return FALLBACK_TITLES[appId] ?? appId;
	}
}

export function useWindowLifecycle({ t, nextZ }: UseWindowLifecycleOptions) {
	const [windows, setWindows] = useState<WindowState[]>([]);
	const [activeWindow, setActiveWindow] = useState<string | null>(null);

	const windowsRef = useRef<WindowState[]>([]);
	const activeWindowRef = useRef<string | null>(null);

	useEffect(() => {
		windowsRef.current = windows;
	}, [windows]);

	useEffect(() => {
		activeWindowRef.current = activeWindow;
	}, [activeWindow]);

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
			const isMobile = getIsMobile();
			const visibleCount = windowsRef.current.filter(
				(w) => !w.minimized,
			).length;

			const newWindow: WindowState = {
				id,
				appId,
				title: deriveTitle(appId, data, t),
				data,
				minimized: false,
				maximized: isMobile,
				position: {
					x: WINDOW_OFFSET_X + visibleCount * WINDOW_STAGGER,
					y: WINDOW_OFFSET_Y + visibleCount * WINDOW_STAGGER,
				},
				zIndex: z,
			};

			setWindows((prev) => [...prev, newWindow]);
			setActiveWindow(id);
		},
		[nextZ, t],
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

			if (!win) {
				openWindow(appId);
				return;
			}

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

			if (activeWindowRef.current === win.id) {
				setWindows((prev) =>
					prev.map((w) => (w.id === win.id ? { ...w, minimized: true } : w)),
				);
				setActiveWindow(null);
				return;
			}

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
