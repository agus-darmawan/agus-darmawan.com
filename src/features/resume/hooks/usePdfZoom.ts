import { useCallback, useState } from "react";

export const ZOOM_MIN = 0.4;
export const ZOOM_MAX = 3;
const ZOOM_STEP = 0.15;

const round = (z: number) => Math.round(z * 100) / 100;

export function usePdfZoom(initial = 1) {
	const [zoom, setZoom] = useState(initial);

	const zoomIn = useCallback(
		() => setZoom((z) => Math.min(round(z + ZOOM_STEP), ZOOM_MAX)),
		[],
	);
	const zoomOut = useCallback(
		() => setZoom((z) => Math.max(round(z - ZOOM_STEP), ZOOM_MIN)),
		[],
	);
	const resetZoom = useCallback(() => setZoom(initial), [initial]);

	return { zoom, zoomIn, zoomOut, resetZoom };
}
