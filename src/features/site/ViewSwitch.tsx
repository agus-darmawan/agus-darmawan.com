"use client";

import { useTranslations } from "next-intl";
import { DesktopLink } from "./DesktopLink";

/** Website / Desktop segmented control: you are on the website. */
export function ViewSwitch() {
	const t = useTranslations("Site.footer");

	return (
		<div className="inline-flex rounded-lg border border-(--site-line) p-0.5 text-sm">
			<span
				aria-current="true"
				className="rounded-md bg-(--site-bg) px-2.5 py-1 font-medium text-(--site-ink) shadow-sm"
			>
				{t("website")}
			</span>
			<DesktopLink className="rounded-md px-2.5 py-1 text-(--site-muted) transition-colors hover:text-(--site-ink)">
				{t("desktop")}
			</DesktopLink>
		</div>
	);
}
