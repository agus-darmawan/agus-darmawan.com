import { useCallback, useEffect, useRef, useState } from "react";
import {
	DRAG_THRESHOLD,
	floatingWidth,
	SNAP_THRESHOLD,
	TOP_BAR_HEIGHT,
} from "@/constants/window";
import type { SnapZone, WindowState } from "@/types/app";

/** Which zone (if any) the pointer is over, in viewport coordinates. */
function getSnapZone(clientX: number, clientY: number): SnapZone {
	if (clientX < SNAP_THRESHOLD) return "left";
	if (clientX > window.innerWidth - SNAP_THRESHOLD) return "right";
	if (clientY < TOP_BAR_HEIGHT + SNAP_THRESHOLD) return "full";
	return null;
}

interface UseWindowDragOptions {
	getWindows: () => WindowState[];
	onBringToFront: (id: string) => void;
	onPositionChange: (id: string, x: number, y: number) => void;
	onSnap: (id: string, zone: SnapZone) => void;
}

interface PressState {
	id: string;
	startX: number;
	startY: number;
	/** Pointer → window position offset, in the same space as `win.position`. */
	offsetX: number;
	offsetY: number;
	/** Where the pointer grabbed the window and how wide it was (for unsnapping). */
	grabX: number;
	rectWidth: number;
	wasSnapped: boolean;
	/** Floating position before the drag, restored when the drop snaps again. */
	origin: { x: number; y: number };
	started: boolean;
}

/**
 * Title-bar dragging with edge snapping.
 *
 * A press only becomes a drag after the pointer moves DRAG_THRESHOLD px, and
 * presses on title-bar controls are ignored. Previously mousedown alone
 * un-snapped the window, so clicking ✕ on a window snapped to full screen
 * shrank it to a half-screen snap (the click never reached the button)
 * instead of closing it.
 */
export function useWindowDrag({
	getWindows,
	onBringToFront,
	onPositionChange,
	onSnap,
}: UseWindowDragOptions) {
	const [armed, setArmed] = useState<string | null>(null);
	const [dragging, setDragging] = useState<string | null>(null);
	const [snapPreview, setSnapPreview] = useState<SnapZone>(null);
	const press = useRef<PressState | null>(null);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent, id: string) => {
			if (e.button !== 0) return;
			// Mobile windows are always full screen and never draggable.
			if (window.innerWidth < 768) return;

			const target = e.target as HTMLElement;
			if (!target.closest(".window-titlebar")) return;
			if (target.closest("button, a, input, select, textarea")) return;

			const win = getWindows().find((w) => w.id === id);
			if (!win || win.maximized) return;

			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			press.current = {
				id,
				startX: e.clientX,
				startY: e.clientY,
				offsetX: e.clientX - win.position.x,
				offsetY: e.clientY - win.position.y,
				grabX: e.clientX - rect.left,
				rectWidth: rect.width,
				wasSnapped: win.snapZone !== null,
				origin: { ...win.position },
				started: false,
			};
			setArmed(id);
		},
		[getWindows],
	);

	useEffect(() => {
		if (!armed) return;

		const onMove = (e: MouseEvent) => {
			const p = press.current;
			if (!p) return;

			if (!p.started) {
				const moved = Math.hypot(e.clientX - p.startX, e.clientY - p.startY);
				if (moved < DRAG_THRESHOLD) return;
				p.started = true;
				onBringToFront(p.id);
				setDragging(p.id);

				if (p.wasSnapped) {
					// Un-snap under the cursor: keep the grab point at the same
					// relative x on the (narrower) floating window. Snapped windows
					// sit at the container's top (y = 0), so y just follows the delta.
					onSnap(p.id, null);
					const ratio = floatingWidth(window.innerWidth) / p.rectWidth;
					p.offsetX = p.grabX * ratio;
					p.offsetY = p.startY;
				}
			}

			onPositionChange(
				p.id,
				Math.max(0, e.clientX - p.offsetX),
				Math.max(0, e.clientY - p.offsetY),
			);
			setSnapPreview(getSnapZone(e.clientX, e.clientY));
		};

		const onUp = (e: MouseEvent) => {
			const p = press.current;
			if (p?.started) {
				const zone = getSnapZone(e.clientX, e.clientY);
				if (zone) {
					onSnap(p.id, zone);
					// Remember the pre-drag floating spot for when it's un-snapped.
					onPositionChange(p.id, p.origin.x, p.origin.y);
				}
			}
			press.current = null;
			setArmed(null);
			setDragging(null);
			setSnapPreview(null);
		};

		window.addEventListener("mousemove", onMove, { passive: true });
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, [armed, onBringToFront, onPositionChange, onSnap]);

	return { dragging, snapPreview, handleMouseDown };
}
