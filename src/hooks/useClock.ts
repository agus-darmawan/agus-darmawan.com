import { useEffect, useState } from "react";

/**
 * Returns a Date that updates every second,
 * synced to the actual wall-clock second (no drift).
 */
export function useClock(): Date {
	const [time, setTime] = useState(() => new Date());

	useEffect(() => {
		// Sync to the next full second first, then tick every 1 000 ms
		const msToNextSecond = 1_000 - new Date().getMilliseconds();

		const timeout = setTimeout(() => {
			setTime(new Date());
			const interval = setInterval(() => setTime(new Date()), 1_000);
			return () => clearInterval(interval);
		}, msToNextSecond);

		return () => clearTimeout(timeout);
	}, []);

	return time;
}
