"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WindowState } from "@/types/app";

const BASE_Z_INDEX = 100;
const WINDOW_STAGGER = 36;
const WINDOW_OFFSET_X = 100;
const WINDOW_OFFSET_Y = 64;

type WindowPayload = Record<string, unknown> | undefined;
type TranslateFn = (key: string) => string;

const FALLBACK_TITLES: Record<string, string> = {
	about: "About Me",
	resume: "Resume",
	experience: "Experience",
	projects: "Projects",
	terminal: "Terminal",
	contact: "Contact",
};

export function useWindowManager(t?: TranslateFn) {
	const [windows, setWindows] = useState<WindowState[]>([]);
	const [activeWindow, setActiveWindow] = useState<string | null>(null);
	const [dragging, setDragging] = useState<string | null>(null);

	const zCounter = useRef(BASE_Z_INDEX);
	const dragOffset = useRef({ x: 0, y: 0 });

	// These refs always hold the latest values — no stale closures ever
	const windowsRef = useRef<WindowState[]>([]);
	const activeWindowRef = useRef<string | null>(null);

	// Keep refs in sync
	useEffect(() => {
		windowsRef.current = windows;
	}, [windows]);
	useEffect(() => {
		activeWindowRef.current = activeWindow;
	}, [activeWindow]);

	const nextZ = useCallback(() => {
		zCounter.current += 1;
		return zCounter.current;
	}, []);

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

	const openWindow = useCallback(
		(appId: string, data?: WindowPayload) => {
			// Read from ref — always fresh, no stale closure
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

			const newWin: WindowState = {
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

			setWindows((prev) => [...prev, newWin]);
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

	const minimizeAllWindows = useCallback(() => {
		setWindows((prev) => prev.map((w) => ({ ...w, minimized: true })));
		setActiveWindow(null);
	}, []);

	// THE KEY FIX: Read from refs, NOT from state/closure
	// This function is called from dock icons AND app grid
	const handleDockClick = useCallback(
		(appId: string) => {
			const currentWindows = windowsRef.current; // always latest
			const currentActive = activeWindowRef.current; // always latest

			const win = currentWindows.find((w) => w.appId === appId);

			// No window exists yet → open fresh
			if (!win) {
				openWindow(appId);
				return;
			}

			// Window is minimized → restore it
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

			// Window is visible AND currently focused → minimize it
			if (currentActive === win.id) {
				setWindows((prev) =>
					prev.map((w) => (w.id === win.id ? { ...w, minimized: true } : w)),
				);
				setActiveWindow(null);
				return;
			}

			// Window is visible but not focused → bring to front
			const z = nextZ();
			setWindows((prev) =>
				prev.map((w) => (w.id === win.id ? { ...w, zIndex: z } : w)),
			);
			setActiveWindow(win.id);
		},
		[nextZ, openWindow],
	); // NO activeWindow in deps — we use the ref

	const handleMouseDown = useCallback(
		(e: React.MouseEvent, id: string) => {
			const win = windowsRef.current.find((w) => w.id === id);
			if (!win || win.maximized) return;

			const target = e.target as HTMLElement;
			if (!target.closest(".window-titlebar")) return;

			bringToFront(id);
			setDragging(id);
			dragOffset.current = {
				x: e.clientX - win.position.x,
				y: e.clientY - win.position.y,
			};
		},
		[bringToFront],
	);

	useEffect(() => {
		if (!dragging) return;

		const onMove = (e: MouseEvent) => {
			setWindows((prev) =>
				prev.map((w) =>
					w.id === dragging
						? {
								...w,
								position: {
									x: Math.max(0, e.clientX - dragOffset.current.x),
									y: Math.max(0, e.clientY - dragOffset.current.y),
								},
							}
						: w,
				),
			);
		};

		const onUp = () => setDragging(null);
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, [dragging]);

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
