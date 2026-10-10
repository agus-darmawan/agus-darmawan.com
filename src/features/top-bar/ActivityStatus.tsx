"use client";

import { useTranslations } from "next-intl";
import { useWindowStore } from "@/store/useWindowStore";

export function ActivityStatus() {
	const t = useTranslations("TopBar");
	const tApps = useTranslations("Dock");
	const activeAppId = useWindowStore(
		(s) => s.windows.find((w) => w.id === s.activeWindowId)?.appId,
	);

	return (
		<div className="flex items-center gap-2 px-3 py-1 select-none cursor-default text-(--topbar-text)">
			<span className="text-sm font-medium">{t("activities")}</span>
			{activeAppId && (
				<span className="hidden md:inline text-xs max-w-24 truncate text-(--panel-text-muted)">
					{tApps.has(activeAppId) ? tApps(activeAppId) : activeAppId}
				</span>
			)}
		</div>
	);
}
