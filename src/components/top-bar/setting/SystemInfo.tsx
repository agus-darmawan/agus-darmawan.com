interface SystemInfoProps {
	ping: number | null;
	batteryLevel: number | null;
	charging: boolean;
	t: (key: string) => string;
}

/**
 * Displays system information such as network ping and battery status.
 */

export function SystemInfo({
	ping,
	batteryLevel,
	charging,
	t,
}: SystemInfoProps) {
	return (
		<div className="px-4 py-2 space-y-1 text-xs text-gray-400">
			<div className="flex justify-between">
				<span>{t("network")}</span>
				<span>{ping != null ? `${ping}ms` : t("offline")}</span>
			</div>

			{batteryLevel !== null && (
				<div className="flex justify-between">
					<span>{t("battery")}</span>
					<span>
						{batteryLevel}%{charging ? ` (${t("charging")})` : ""}
					</span>
				</div>
			)}
		</div>
	);
}
