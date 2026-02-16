"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WindowState } from "@/types/app";

const APP_TITLES: Record<string, string> = {
	about: "About Me",
	resume: "Resume",
	experience: "Experience",
	projects: "Projects",
	terminal: "Terminal",
	contact: "Contact",
};

const BASE_Z_INDEX = 100;
const WINDOW_STAGGER = 40;
const WINDOW_OFFSET_START = 120;
const WINDOW_OFFSET_Y_START = 80;

type WindowPayload = Record<string, unknown> | undefined;

export function useWindowManager() {
	const [windows, setWindows] = useState<WindowState[]>([]);
	const [activeWindow, setActiveWindow] = useState<string | null>(null);
	const [dragging, setDragging] = useState<string | null>(null);

	const zIndexCounter = useRef(BASE_Z_INDEX);
	const dragOffset = useRef({ x: 0, y: 0 });

	const nextZ = useCallback(() => {
		zIndexCounter.current += 1;
		return zIndexCounter.current;
	}, []);

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

				const newWindow: WindowState = {
					id,
					appId,
					title: APP_TITLES[appId] ?? appId,
					data,
					minimized: false,
					maximized: false,
					position: {
						x: WINDOW_OFFSET_START + prev.length * WINDOW_STAGGER,
						y: WINDOW_OFFSET_Y_START + prev.length * WINDOW_STAGGER,
					},
					zIndex: z,
				};

				setActiveWindow(id);
				return [...prev, newWindow];
			});
		},
		[nextZ],
	);

	const closeWindow = useCallback((id: string) => {
		setWindows((prev) => prev.filter((w) => w.id !== id));
		setActiveWindow((prev) => (prev === id ? null : prev));
	}, []);

	const minimizeWindow = useCallback((id: string) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
		);
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

	const handleDockClick = useCallback(
		(appId: string) => {
			setWindows((prev) => {
				const win = prev.find((w) => w.appId === appId);

				if (!win) {
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

	useEffect(() => {
		if (!dragging) return;

		const onMouseMove = (e: MouseEvent) => {
			setWindows((prev) =>
				prev.map((w) =>
					w.id === dragging
						? {
								...w,
								position: {
									x: e.clientX - dragOffset.current.x,
									y: e.clientY - dragOffset.current.y,
								},
							}
						: w,
				),
			);
		};

		const onMouseUp = () => setDragging(null);

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [dragging]);

	return {
		windows,
		activeWindow,
		dragging,
		openWindow,
		closeWindow,
		minimizeWindow,
		toggleMaximize,
		handleDockClick,
		handleMouseDown,
		bringToFront,
		setActiveWindow,
	};
}
