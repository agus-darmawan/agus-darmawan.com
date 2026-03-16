"use client";

import { Battery, BatteryCharging, Wifi } from "lucide-react";
import { usePing } from "@/hooks/top-bar/usePing";
import { useBattery } from "@/hooks/useBattery";
import { RefreshIndicator } from "./RefreshIndicator";

/**
 * SystemStatus — shows WiFi latency and battery in the top bar.
 */
export function SystemStatus() {
	const { level, charging } = useBattery();
	const { ping, refreshProgress } = usePing();

	const itemClass =
		"flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-default";

	return (
		<div
			className="hidden sm:flex items-center gap-0.5"
			style={{ color: "var(--topbar-text)" }}
		>
			<div
				className={itemClass}
				onMouseEnter={(e) => {
					(e.currentTarget as HTMLElement).style.background =
						"var(--topbar-hover)";
				}}
				onMouseLeave={(e) => {
					(e.currentTarget as HTMLElement).style.background = "transparent";
				}}
			>
				<Wifi className="w-3.5 h-3.5 shrink-0" />
				<span className="text-[10px] tabular-nums w-8">
					{ping != null ? `${ping}ms` : "—"}
				</span>
				<RefreshIndicator progress={refreshProgress} />
			</div>

			{level !== null && (
				<div
					className={itemClass}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.background =
							"var(--topbar-hover)";
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.background = "transparent";
					}}
				>
					{charging ? (
						<BatteryCharging className="w-4 h-4 shrink-0" />
					) : (
						<Battery className="w-4 h-4 shrink-0" />
					)}
					<span className="text-[10px] tabular-nums">{level}%</span>
				</div>
			)}
		</div>
	);
}
