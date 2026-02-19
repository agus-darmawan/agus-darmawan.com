import { useEffect, useState } from "react";

const TICK_MS = 250;

/**
 * Returns a smooth 0→1 progress value that updates on a 250ms interval,
 * representing how close the next refetch is.
 *
 * Without this, `refreshProgress` only updates on TanStack Query re-renders
 * (i.e. on refetch) instead of smoothly animating the arc indicator.
 *
 * @param dataUpdatedAt  - timestamp of last successful fetch (from useQuery)
 * @param refetchInterval - polling interval in ms
 */
export function useRefreshProgress(
	dataUpdatedAt: number,
	refetchInterval: number,
): number {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const tick = () => {
			setProgress(
				dataUpdatedAt
					? Math.min((Date.now() - dataUpdatedAt) / refetchInterval, 1)
					: 0,
			);
		};

		tick();
		const id = setInterval(tick, TICK_MS);
		return () => clearInterval(id);
	}, [dataUpdatedAt, refetchInterval]);

	return progress;
}
