"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useBattery } from "@/hooks/useBattery";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSwitchLocale } from "@/hooks/useSwitchLocale";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { usePing } from "../hooks/usePing";
import { useSpotify } from "../hooks/useSpotify";
import { SpotifyPanel } from "../spotify/SpotifyPanel";
import { Divider } from "./Divider";
import { MenuItem } from "./MenuItem";
import { MenuTrigger } from "./MenuTrigger";
import { SystemInfo } from "./SystemInfo";
import { TogglePill } from "./TogglePill";

/** The GNOME system menu: theme, language, now playing and system info. */
export function SettingsMenu() {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const panelId = useId();
	const t = useTranslations("TopBar");
	const { resolvedTheme, setTheme } = useTheme();
	const { locale, switchLocale } = useSwitchLocale();
	const { level, charging } = useBattery();
	const { ping } = usePing();
	const { track } = useSpotify();
	const isDark = resolvedTheme !== "light";

	const close = useCallback(() => setOpen(false), []);
	useClickOutside(menuRef, close);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, close]);

	return (
		<div ref={menuRef} className="relative">
			<MenuTrigger
				open={open}
				controls={panelId}
				label={t("settings")}
				onToggle={() => setOpen((v) => !v)}
			/>

			{open && (
				<div
					id={panelId}
					role="dialog"
					aria-label={t("settings")}
					className="absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-1rem)] rounded-xl shadow-2xl border py-2 z-50 animate-fade-in bg-(--panel-bg) border-(--panel-border) text-(--panel-text) backdrop-blur-xl"
				>
					<MenuItem
						role="switch"
						aria-checked={isDark}
						onClick={() => setTheme(isDark ? "light" : "dark")}
					>
						<span className="flex items-center gap-3">
							{isDark ? (
								<Moon className="w-4 h-4 text-blue-300" aria-hidden />
							) : (
								<Sun className="w-4 h-4 text-yellow-300" aria-hidden />
							)}
							<span className="text-sm">
								{isDark ? t("darkMode") : t("lightMode")}
							</span>
						</span>
						<TogglePill active={isDark} />
					</MenuItem>

					<Divider />

					<MenuItem onClick={() => switchLocale()}>
						<span className="flex items-center gap-3">
							<Languages className="w-4 h-4" aria-hidden />
							<span className="text-sm">{t("language")}</span>
						</span>
						<span className="flex items-center gap-1.5">
							{routing.locales.map((code) => (
								<span
									key={code}
									className={cn(
										"text-xs px-1.5 py-0.5 rounded font-medium uppercase transition-colors",
										locale === code
											? "bg-ubuntu-orange text-white"
											: "opacity-40",
									)}
								>
									{code}
								</span>
							))}
						</span>
					</MenuItem>

					{track && (
						<>
							<Divider />
							<SpotifyPanel track={track} />
						</>
					)}

					<Divider />

					<SystemInfo ping={ping} batteryLevel={level} charging={charging} />
				</div>
			)}
		</div>
	);
}
