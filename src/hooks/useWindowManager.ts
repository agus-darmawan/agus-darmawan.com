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
			setWindows((prev) => {
				const existing = prev.find((w) => w.appId === appId);

				if (existing) {
					const z = nextZ();
					setActiveWindow(existing.id);
					return prev.map((w) =>
						w.id === existing.id
							? { ...w, minimized: false, data, zIndex: z }
							: w,
					);
				}

				const id = `${appId}-${Date.now()}`;
				const z = nextZ();
				const count = prev.length;

				const newWindow: WindowState = {
					id,
					appId,
					title: getTitle(appId),
					data,
					minimized: false,
					maximized: false,
					position: {
						x: WINDOW_OFFSET_X + count * WINDOW_STAGGER,
						y: WINDOW_OFFSET_Y + count * WINDOW_STAGGER,
					},
					zIndex: z,
				};

				setActiveWindow(id);
				return [...prev, newWindow];
			});
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

	const handleDockClick = useCallback(
		(appId: string) => {
			setWindows((prev) => {
				const win = prev.find((w) => w.appId === appId);

				if (!win) {
					// Defer to avoid setState-during-render
					setTimeout(() => openWindow(appId), 0);
					return prev;
				}

				if (win.minimized) {
					const z = nextZ();
					setActiveWindow(win.id);
					return prev.map((w) =>
						w.id === win.id ? { ...w, minimized: false, zIndex: z } : w,
					);
				}

				// If already active → minimize; else bring to front
				if (activeWindow === win.id) {
					return prev.map((w) =>
						w.id === win.id ? { ...w, minimized: true } : w,
					);
				}

				bringToFront(win.id);
				return prev;
			});
		},
		[nextZ, openWindow, bringToFront, activeWindow],
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent, id: string) => {
			const win = windows.find((w) => w.id === id);
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
		[windows, bringToFront],
	);

	// Mouse move / up for dragging
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
