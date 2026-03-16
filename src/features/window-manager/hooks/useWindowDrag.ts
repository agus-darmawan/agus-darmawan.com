import { useCallback, useEffect, useRef, useState } from "react";
import type { WindowState } from "@/types/app";

interface UseWindowDragOptions {
	windowsRef: React.MutableRefObject<WindowState[]>;
	onBringToFront: (id: string) => void;
	onPositionChange: (id: string, x: number, y: number) => void;
}

/**
 * Handles mouse-driven window dragging.
 * Reads windows from a ref (not state) to avoid stale closure issues.
 */
export function useWindowDrag({
	windowsRef,
	onBringToFront,
	onPositionChange,
}: UseWindowDragOptions) {
	const [dragging, setDragging] = useState<string | null>(null);
	const dragOffset = useRef({ x: 0, y: 0 });

	const handleMouseDown = useCallback(
		(e: React.MouseEvent, id: string) => {
			const win = windowsRef.current.find((w) => w.id === id);
			if (!win || win.maximized) return;

			const target = e.target as HTMLElement;
			if (!target.closest(".window-titlebar")) return;

			onBringToFront(id);
			setDragging(id);
			dragOffset.current = {
				x: e.clientX - win.position.x,
				y: e.clientY - win.position.y,
			};
		},
		[windowsRef, onBringToFront],
	);

	useEffect(() => {
		if (!dragging) return;

		const onMove = (e: MouseEvent) => {
			onPositionChange(
				dragging,
				Math.max(0, e.clientX - dragOffset.current.x),
				Math.max(0, e.clientY - dragOffset.current.y),
			);
		};

		const onUp = () => setDragging(null);

		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, [dragging, onPositionChange]);

	return { dragging, handleMouseDown };
}
