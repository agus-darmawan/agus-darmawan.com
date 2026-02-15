"use client";

import { Battery, BatteryCharging, Wifi } from "lucide-react";
import { usePing } from "@/hooks/top-bar/usePing";
import { useBattery } from "@/hooks/useBattery";
import { RefreshIndicator } from "./RefreshIndicator";

/**
 * SystemStatus — shows WiFi ping and battery status in the top bar.
 * Gets data from usePing and useBattery hooks, which listen to browser APIs and update in real-time.
 */
export function SystemStatus() {
	const { level, charging } = useBattery();
	const { ping, refreshProgress } = usePing();

	return (
		<div className="hidden sm:flex items-center gap-0.5">
			<div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors">
				<Wifi className="w-3.5 h-3.5" />
				<span className="text-[10px] tabular-nums w-8">
					{ping != null ? `${ping}ms` : "—"}
				</span>
				<RefreshIndicator progress={refreshProgress} />
			</div>

			{level !== null && (
				<div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors">
					{charging ? (
						<BatteryCharging className="w-4 h-4" />
					) : (
						<Battery className="w-4 h-4" />
					)}
					<span className="text-[10px] tabular-nums">{level}%</span>
				</div>
			)}
		</div>
	);
}
