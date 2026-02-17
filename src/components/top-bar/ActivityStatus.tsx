"use client";

import { useTranslations } from "next-intl";
import { useAppStore } from "@/store/useAppStore";

/**
 * ActivityStatus — shows "Activities" label and the most-recently-opened app name.
 */
export function ActivityStatus() {
	const t = useTranslations("TopBar");
	const openApps = useAppStore((s) => s.openApps);
	const getLastOpenedApp = useAppStore((s) => s.getLastOpenedApp);

	const hasApps = openApps.length > 0;
	const lastApp = getLastOpenedApp();

	return (
		<div
			className="flex items-center gap-2 px-3 py-1 select-none cursor-default"
			style={{ color: "var(--topbar-text)" }}
		>
			<span className="text-sm font-medium">{t("activities")}</span>

			{hasApps && lastApp && (
				<span
					className="hidden md:inline text-xs max-w-24 truncate"
					style={{ color: "var(--panel-text-muted)" }}
				>
					{lastApp.icon && (
						<span className="mr-0.5" aria-hidden>
							{lastApp.icon}
						</span>
					)}
					{lastApp.name}
				</span>
			)}
		</div>
	);
}
