"use client";

import { useTranslations } from "next-intl";
import { useWindowStore } from "@/store/useWindowStore";

export function ActivityStatus() {
	const t = useTranslations("TopBar");

	// Ambil langsung dari state — reactive
	const windows = useWindowStore((s) => s.windows);
	const activeWindowId = useWindowStore((s) => s.activeWindowId);

	// Derive di komponen — bukan di store selector
	const hasApps = windows.length > 0;
	const activeApp = windows.find((w) => w.id === activeWindowId) ?? null;

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
					{activeApp.title}
				</span>
			)}
		</div>
	);
}
