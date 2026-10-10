"use client";

import { Battery, BatteryCharging, Wifi, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useBattery } from "@/hooks/useBattery";
import { PING_INTERVAL, usePing } from "./hooks/usePing";
import { RefreshIndicator } from "./RefreshIndicator";

const ITEM =
	"flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-default hover:bg-(--topbar-hover)";

/** Network latency and battery, shown in the top bar from `sm` up. */
export function SystemStatus() {
	const t = useTranslations("TopBar");
	const { level, charging } = useBattery();
	const { ping, updatedAt } = usePing();
	const BatteryIcon = charging ? BatteryCharging : Battery;

	return (
		<div className="hidden sm:flex items-center gap-0.5">
			<div className={ITEM} title={t("network")}>
				{ping === null ? (
					<WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden />
				) : (
					<Wifi className="w-3.5 h-3.5 shrink-0" aria-hidden />
				)}
				<span className="text-[10px] tabular-nums w-8">
					{ping === null ? "—" : `${ping}ms`}
				</span>
				<RefreshIndicator updatedAt={updatedAt} interval={PING_INTERVAL} />
			</div>

			{level !== null && (
				<div className={ITEM} title={t("battery")}>
					<BatteryIcon className="w-4 h-4 shrink-0" aria-hidden />
					<span className="text-[10px] tabular-nums">{level}%</span>
				</div>
			)}
		</div>
	);
}
