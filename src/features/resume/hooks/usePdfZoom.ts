import { useCallback, useState } from "react";

interface UsePdfZoomResult {
	zoom: number;
	zoomIn: () => void;
	zoomOut: () => void;
	resetZoom: () => void;
}

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.15;

export function usePdfZoom(initial = 1): UsePdfZoomResult {
	const [zoom, setZoom] = useState(initial);

	const zoomIn = useCallback(
		() => setZoom((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX)),
		[],
	);
	const zoomOut = useCallback(
		() => setZoom((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN)),
		[],
	);
	const resetZoom = useCallback(() => setZoom(1), []);

	return { zoom, zoomIn, zoomOut, resetZoom };
}
