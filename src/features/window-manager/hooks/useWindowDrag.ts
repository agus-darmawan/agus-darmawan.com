import { useCallback, useEffect, useRef, useState } from "react";
import type { WindowState } from "@/types/app";

// ── Snap config ───────────────────────────────────────────────────────────────

const SNAP_THRESHOLD = 48; // px from edge to trigger snap
const TOP_BAR_HEIGHT = 32; // height of the top bar

type SnapZone = "left" | "right" | "full" | null;

interface SnapResult {
	snapped: boolean;
	zone: SnapZone;
	x: number;
	y: number;
	width?: string;
	height?: string;
}

function getSnapPosition(x: number, y: number): SnapResult {
	const vw = window.innerWidth;

	// Snap left — drag to left edge
	if (x < SNAP_THRESHOLD) {
		return {
			snapped: true,
			zone: "left",
			x: 0,
			y: TOP_BAR_HEIGHT,
			width: "50vw",
			height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
		};
	}

	// Snap right — drag to right edge
	if (x > vw - SNAP_THRESHOLD) {
		return {
			snapped: true,
			zone: "right",
			x: vw / 2,
			y: TOP_BAR_HEIGHT,
			width: "50vw",
			height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
		};
	}

	// Snap top — maximize
	if (y < TOP_BAR_HEIGHT + SNAP_THRESHOLD) {
		return {
			snapped: true,
			zone: "full",
			x: 0,
			y: TOP_BAR_HEIGHT,
			width: "100vw",
			height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
		};
	}

	return { snapped: false, zone: null, x, y };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface UseWindowDragOptions {
	getWindows: () => WindowState[];
	onBringToFront: (id: string) => void;
	onPositionChange: (id: string, x: number, y: number) => void;
	onSnap: (id: string, zone: SnapZone) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useWindowDrag({
	getWindows,
	onBringToFront,
	onPositionChange,
	onSnap,
}: UseWindowDragOptions) {
	const [dragging, setDragging] = useState<string | null>(null);
	const [snapPreview, setSnapPreview] = useState<SnapResult | null>(null);
	const dragOffset = useRef({ x: 0, y: 0 });

	const handleMouseDown = useCallback(
		(e: React.MouseEvent, id: string) => {
			const win = getWindows().find((w) => w.id === id);
			if (!win || win.maximized) return;

			const target = e.target as HTMLElement;
			if (!target.closest(".window-titlebar")) return;

			onBringToFront(id);
			setDragging(id);

			// Kalau window lagi snapped (half-screen), lepas dulu jadi floating
			// sebelum mulai drag — biar user bisa narik dari posisi split.
			if (win.snapZone) {
				onSnap(id, null);
			}

			dragOffset.current = {
				x: e.clientX - win.position.x,
				y: e.clientY - win.position.y,
			};
		},
		[getWindows, onBringToFront, onSnap],
	);

	useEffect(() => {
		if (!dragging) return;

		const onMove = (e: MouseEvent) => {
			const x = Math.max(0, e.clientX - dragOffset.current.x);
			const y = Math.max(0, e.clientY - dragOffset.current.y);

			onPositionChange(dragging, x, y);

			// Show snap preview
			const snap = getSnapPosition(e.clientX, e.clientY);
			setSnapPreview(snap.snapped ? snap : null);
		};

		const onUp = (e: MouseEvent) => {
			// Apply snap on release
			const snap = getSnapPosition(e.clientX, e.clientY);
			if (snap.snapped) {
				onPositionChange(dragging, snap.x, snap.y);
				onSnap(dragging, snap.zone);
			}

			setDragging(null);
			setSnapPreview(null);
		};

		window.addEventListener("mousemove", onMove, { passive: true });
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, [dragging, onPositionChange, onSnap]);

	return { dragging, snapPreview, handleMouseDown };
}
