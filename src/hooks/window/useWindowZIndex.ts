import { useCallback, useRef } from "react";
import { WINDOW_BASE_Z_INDEX } from "@/constants/window";

/**
 * Provides a monotonically-increasing z-index generator.
 * Isolated so the counter survives re-renders without polluting other hooks.
 */
export function useWindowZIndex() {
	const counter = useRef(WINDOW_BASE_Z_INDEX);

	const nextZ = useCallback(() => {
		counter.current += 1;
		return counter.current;
	}, []);

	return { nextZ };
}
