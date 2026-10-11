"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

/**
 * Light/dark switch. The theme is only known after hydration, so the icon
 * and label render client-side (no flash of the wrong icon).
 */
export function ThemeToggle({
	withLabel = false,
	className,
}: {
	withLabel?: boolean;
	className?: string;
}) {
	const t = useTranslations("Site.theme");
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();
	const dark = resolvedTheme !== "light";
	const Icon = dark ? Sun : Moon;
	const label = mounted ? (dark ? t("toLight") : t("toDark")) : t("label");

	return (
		<button
			type="button"
			onClick={() => setTheme(dark ? "light" : "dark")}
			aria-label={label}
			title={label}
			className={cn(
				"inline-flex h-8 items-center gap-2 rounded-lg px-2 text-sm text-(--site-muted) transition-colors hover:bg-(--site-raised) hover:text-(--site-ink)",
				className,
			)}
		>
			{mounted ? (
				<Icon className="size-4" aria-hidden />
			) : (
				<span className="size-4" aria-hidden />
			)}
			{withLabel && mounted && <span>{dark ? t("light") : t("dark")}</span>}
		</button>
	);
}
