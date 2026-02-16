"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WindowState } from "@/types/app";

type WindowPayload = Record<string, unknown> | undefined;

export const useWindowManager = () => {
	const [windows, setWindows] = useState<WindowState[]>([]);
	const [activeWindow, setActiveWindow] = useState<string | null>(null);

	const zIndexRef = useRef(100);

	const [dragging, setDragging] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

	const appTitles: Record<string, string> = {
		about: "About Me",
		resume: "Resume",
		experience: "Experience",
		projects: "Projects",
	};

	// Stable z-index generator (Biome-safe)
	const nextZ = useCallback(() => {
		zIndexRef.current += 1;
		return zIndexRef.current;
	}, []);

	// -----------------------------
	// OPEN
	// -----------------------------
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

				const newWindow: WindowState = {
					id,
					appId,
					title: appTitles[appId] || appId,
					data,
					minimized: false,
					maximized: false,
					position: {
						x: 120 + prev.length * 40,
						y: 80 + prev.length * 40,
					},
					zIndex: nextZ(),
				};

				setActiveWindow(id);
				return [...prev, newWindow];
			});
		},
		[nextZ],
	);

	// -----------------------------
	// CLOSE
	// -----------------------------
	const closeWindow = useCallback((id: string) => {
		setWindows((prev) => prev.filter((w) => w.id !== id));
		setActiveWindow((prev) => (prev === id ? null : prev));
	}, []);

	// -----------------------------
	// MINIMIZE
	// -----------------------------
	const minimizeWindow = useCallback((id: string) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
		);
	}, []);

	// -----------------------------
	// MAXIMIZE
	// -----------------------------
	const toggleMaximize = useCallback((id: string) => {
		setWindows((prev) =>
			prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
		);
	}, []);

	// -----------------------------
	// FOCUS
	// -----------------------------
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

	// -----------------------------
	// DOCK CLICK
	// -----------------------------
	const handleDockClick = useCallback(
		(appId: string) => {
			setWindows((prev) => {
				const win = prev.find((w) => w.appId === appId);

				if (!win) {
					openWindow(appId);
					return prev;
				}

				if (win.minimized) {
					const z = nextZ();
					setActiveWindow(win.id);

					return prev.map((w) =>
						w.id === win.id ? { ...w, minimized: false, zIndex: z } : w,
					);
				}

				return prev.map((w) =>
					w.id === win.id ? { ...w, minimized: true } : w,
				);
			});
		},
		[nextZ, openWindow],
	);

	// -----------------------------
	// DRAG START
	// -----------------------------
	const handleMouseDown = useCallback(
		(e: React.MouseEvent, id: string) => {
			const win = windows.find((w) => w.id === id);
			if (!win || win.maximized) return;

			if ((e.target as HTMLElement).closest(".window-titlebar")) {
				bringToFront(id);
				setDragging(id);
				setDragOffset({
					x: e.clientX - win.position.x,
					y: e.clientY - win.position.y,
				});
			}
		},
		[windows, bringToFront],
	);

	// -----------------------------
	// DRAG MOVE
	// -----------------------------
	useEffect(() => {
		if (!dragging) return;

		const move = (e: MouseEvent) => {
			setWindows((prev) =>
				prev.map((w) =>
					w.id === dragging
						? {
								...w,
								position: {
									x: e.clientX - dragOffset.x,
									y: e.clientY - dragOffset.y,
								},
							}
						: w,
				),
			);
		};

		const up = () => setDragging(null);

		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);

		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		};
	}, [dragging, dragOffset]);

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
};
