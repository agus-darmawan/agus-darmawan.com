interface SystemInfoProps {
	ping: number | null;
	batteryLevel: number | null;
	charging: boolean;
	t: (key: string) => string;
}

/**
 * SystemInfo — read-only rows showing network latency and battery status.
 */
export function SystemInfo({
	ping,
	batteryLevel,
	charging,
	t,
}: SystemInfoProps) {
	return (
		<div
			className="px-4 py-2 space-y-1.5 text-xs"
			style={{ color: "var(--panel-text-muted)" }}
		>
			<div className="flex justify-between items-center">
				<span>{t("network")}</span>
				<span className="tabular-nums font-medium">
					{ping != null ? `${ping} ms` : t("offline")}
				</span>
			</div>

			{batteryLevel !== null && (
				<div className="flex justify-between items-center">
					<span>{t("battery")}</span>
					<span className="tabular-nums font-medium">
						{batteryLevel}%
						{charging && (
							<span className="ml-1 text-green-400">({t("charging")})</span>
						)}
					</span>
				</div>
			)}
		</div>
	);
}
