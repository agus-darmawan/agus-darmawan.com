"use client";

import { useTranslations } from "next-intl";
import { useAppStore } from "@/store/useAppStore";

/**
 * ActivityStatus — shows "Activities" and the last opened app (if any).
 * Gets open apps from useAppStore, which can be updated from anywhere in the app.
 */
export function ActivityStatus() {
	const t = useTranslations("TopBar");
	const openApps = useAppStore((s) => s.openApps);
	const getLastOpenedApp = useAppStore((s) => s.getLastOpenedApp);

	const hasApps = openApps.length > 0;
	const lastApp = getLastOpenedApp();

	return (
		<div className="flex items-center gap-2 px-3 py-1 select-none cursor-default">
			<span className="text-sm font-medium text-white/90">
				{t("activities")}
			</span>
			{hasApps && (
				<div className="flex items-center gap-1.5">
					{lastApp && (
						<span className="hidden md:inline text-xs text-white/55 max-w-25 truncate">
							{lastApp.icon && <span className="mr-0.5">{lastApp.icon}</span>}
							{lastApp.name}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
