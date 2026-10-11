"use client";

import { PanelsTopLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWebsitePath } from "@/features/desktop/website";
import { Link } from "@/i18n/navigation";
import { rememberUiMode } from "@/lib/ui-mode";

/**
 * The way back to the classic website, always in view. It lands on the
 * page for the window in front, so a project you're reading stays open.
 */
export function WebsiteLink() {
	const t = useTranslations("TopBar");
	const href = useWebsitePath();

	return (
		<Link
			href={href}
			title={t("websiteHint")}
			onClick={() => rememberUiMode("classic")}
			className="flex items-center gap-1.5 h-6 px-2 rounded-md border border-white/15 text-xs font-medium transition-colors text-(--topbar-text) hover:bg-(--topbar-hover) focus-visible:outline-2 focus-visible:outline-white/70"
		>
			<PanelsTopLeft className="size-3.5 shrink-0" aria-hidden />
			{t("website")}
		</Link>
	);
}
