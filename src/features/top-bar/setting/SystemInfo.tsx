import { useTranslations } from "next-intl";

interface SystemInfoProps {
	ping: number | null;
	batteryLevel: number | null;
	charging: boolean;
}

/** Read-only rows: network latency and battery status. */
export function SystemInfo({ ping, batteryLevel, charging }: SystemInfoProps) {
	const t = useTranslations("TopBar");

	return (
		<dl className="px-4 py-2 space-y-1.5 text-xs text-(--panel-text-muted)">
			<div className="flex justify-between items-center">
				<dt>{t("network")}</dt>
				<dd className="tabular-nums font-medium">
					{ping === null ? t("offline") : `${ping} ms`}
				</dd>
			</div>

			{batteryLevel !== null && (
				<div className="flex justify-between items-center">
					<dt>{t("battery")}</dt>
					<dd className="tabular-nums font-medium">
						{batteryLevel}%
						{charging && (
							<span className="ml-1 text-green-400">({t("charging")})</span>
						)}
					</dd>
				</div>
			)}
		</dl>
	);
}
