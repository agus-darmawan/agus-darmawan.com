"use client";

import { useTranslations } from "next-intl";
import { useAppStore } from "@/store/useAppStore";

export function ActivityStatus() {
	const t = useTranslations("TopBar");
	const openApps = useAppStore((s) => s.openApps);
	const getActiveApp = useAppStore((s) => s.getActiveApp);

	const hasApps = openApps.length > 0;
	const activeApp = getActiveApp();

	return (
		<div
			className="flex items-center gap-2 px-3 py-1 select-none cursor-default"
			style={{ color: "var(--topbar-text)" }}
		>
			<span className="text-sm font-medium">{t("activities")}</span>
			{hasApps && activeApp && (
				<span
					className="hidden md:inline text-xs max-w-24 truncate"
					style={{ color: "var(--panel-text-muted)" }}
				>
					{activeApp.icon && (
						<span className="mr-0.5" aria-hidden>
							{activeApp.icon}
						</span>
					)}
					{activeApp.name}
				</span>
			)}
		</div>
	);
}
