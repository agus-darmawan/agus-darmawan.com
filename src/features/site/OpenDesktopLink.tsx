"use client";

import { Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DesktopLink } from "./DesktopLink";

/** Switches to the interactive desktop. `compact` hides the label on phones. */
export function OpenDesktopLink({
	compact = false,
	className,
}: {
	compact?: boolean;
	className?: string;
}) {
	const t = useTranslations("Site");

	return (
		<DesktopLink
			aria-label={compact ? t("openDesktop") : undefined}
			className={cn(
				"inline-flex h-8 items-center gap-1.5 rounded-lg border border-(--site-line) px-2.5 text-[0.8125rem] font-medium text-(--site-ink) transition-colors hover:border-ubuntu-orange hover:text-(--site-link) max-sm:px-2",
				className,
			)}
		>
			<Monitor className="size-3.5 shrink-0" aria-hidden />
			<span className={cn(compact && "max-sm:sr-only")}>
				{t("openDesktop")}
			</span>
		</DesktopLink>
	);
}
