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
				battery = bat;
				battery.addEventListener("levelchange", update);
				battery.addEventListener("chargingchange", update);
				update();
			})
			.catch(() => {
				// Battery API tidak tersedia (Firefox, Safari, semua iOS) — biarkan saja
				// state tetap { level: null, charging: false }, komponen tidak render battery
			});

		return () => {
			if (!battery) return;
			battery.removeEventListener("levelchange", update);
			battery.removeEventListener("chargingchange", update);
		};
	}, []);

	return state;
}
