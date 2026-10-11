"use client";

import { Check, Link2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { localizedPath } from "@/i18n/paths";
import { contentPath } from "@/lib/content/paths";
import type { ContentMeta } from "@/lib/content/types";

/** Copies the item's crawlable page URL — shareable links back into the site. */
export function CopyLinkButton({ item }: { item: ContentMeta }) {
	const t = useTranslations("Content");
	const locale = useLocale();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const id = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(id);
	}, [copied]);

	const copy = async () => {
		const url = new URL(
			localizedPath(locale, contentPath(item)),
			window.location.origin,
		);
		try {
			await navigator.clipboard.writeText(url.href);
			setCopied(true);
		} catch {
			// Clipboard unavailable (insecure context) — nothing sensible to do.
		}
	};

	return (
		<button
			type="button"
			onClick={copy}
			aria-live="polite"
			className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 text-(--text-muted)"
		>
			{copied ? (
				<Check size={12} aria-hidden="true" />
			) : (
				<Link2 size={12} aria-hidden="true" />
			)}
			{copied ? t("linkCopied") : t("share")}
		</button>
	);
}
