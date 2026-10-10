import { useEffect, useState } from "react";

interface BatteryState {
	level: number | null;
	charging: boolean;
}

interface BatteryManager extends EventTarget {
	level: number;
	charging: boolean;
	addEventListener(
		type: "levelchange" | "chargingchange",
		listener: () => void,
	): void;
	removeEventListener(
		type: "levelchange" | "chargingchange",
		listener: () => void,
	): void;
}

interface NavigatorWithBattery extends Navigator {
	getBattery(): Promise<BatteryManager>;
}

export function useBattery(): BatteryState {
	const [state, setState] = useState<BatteryState>({
		level: null,
		charging: false,
	});

	useEffect(() => {
		if (!("getBattery" in navigator)) return;

		let battery: BatteryManager | null = null;
		let cancelled = false;

		const update = () => {
			if (!battery) return;
			setState({
				level: Math.round(battery.level * 100),
				charging: battery.charging,
			});
		};

		(navigator as NavigatorWithBattery)
			.getBattery()
			.then((bat) => {
				// Unmounted before the promise resolved: don't attach listeners
				// that the cleanup below already ran without.
				if (cancelled) return;
				battery = bat;
				battery.addEventListener("levelchange", update);
				battery.addEventListener("chargingchange", update);
				update();
			})
			.catch(() => {
				// No Battery API (Firefox, Safari, iOS): keep `level: null` so the
				// UI simply hides the battery item.
			});

		return () => {
			cancelled = true;
			if (!battery) return;
			battery.removeEventListener("levelchange", update);
			battery.removeEventListener("chargingchange", update);
		};
	}, []);

	return state;
}
