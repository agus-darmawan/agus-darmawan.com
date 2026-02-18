"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePing } from "@/hooks/top-bar/usePing";
import { useSpotify } from "@/hooks/top-bar/useSpotify";
import { useBattery } from "@/hooks/useBattery";
import { useClickOutside } from "@/hooks/useClickOutside";
import { usePathname, useRouter } from "@/i18n/navigation";
import { SpotifyPanel } from "../spotify/SpotifyPanel";
import { Divider } from "./Divider";
import { MenuItem } from "./MenuItem";
import { MenuTrigger } from "./MenuTrigger";
import { SystemInfo } from "./SystemInfo";
import { TogglePill } from "./TogglePill";

export function SettingsMenu() {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null!);
	const isInitialized = useRef(false);

	const t = useTranslations("TopBar");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const { level, charging } = useBattery();
	const { ping } = usePing();
	const { track } = useSpotify();

	const isDark = theme === "dark";

	// Restore state from sessionStorage on mount
	useEffect(() => {
		if (!isInitialized.current) {
			const saved = sessionStorage.getItem("settingsMenuOpen");
			if (saved === "true") {
				setOpen(true);
			}
			isInitialized.current = true;
		}
	}, []);

	// Persist state to sessionStorage whenever it changes
	useEffect(() => {
		if (isInitialized.current) {
			sessionStorage.setItem("settingsMenuOpen", open ? "true" : "false");
		}
	}, [open]);

	useClickOutside({ ref: menuRef, onOutside: () => setOpen(false) });

	const toggleTheme = useCallback(() => {
		setTheme(isDark ? "light" : "dark");
	}, [isDark, setTheme]);

	// Keep panel open when switching language — router.push re-renders but
	// the component state is preserved because we're NOT closing on nav.
	const toggleLanguage = useCallback(() => {
		router.push(pathname, { locale: locale === "en" ? "id" : "en" });
		// intentionally do NOT call setOpen(false) here
	}, [locale, pathname, router]);

	return (
		<div ref={menuRef} className="relative">
			<MenuTrigger open={open} onToggle={() => setOpen((v) => !v)} />

			{open && (
				<div
					className="absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-1rem)] rounded-xl shadow-2xl border py-2 z-50 animate-fade-in"
					style={{
						background: "var(--panel-bg)",
						borderColor: "var(--panel-border)",
						color: "var(--panel-text)",
						backdropFilter: "blur(20px)",
						WebkitBackdropFilter: "blur(20px)",
					}}
				>
					{/* Theme toggle */}
					<MenuItem onClick={toggleTheme}>
						<div className="flex items-center gap-3">
							{isDark ? (
								<Moon className="w-4 h-4 text-blue-300" />
							) : (
								<Sun className="w-4 h-4 text-yellow-300" />
							)}
							<span className="text-sm">
								{isDark ? t("darkMode") : t("lightMode")}
							</span>
						</div>
						<TogglePill active={isDark} />
					</MenuItem>

					<Divider />

					{/* Language toggle */}
					<MenuItem onClick={toggleLanguage}>
						<div className="flex items-center gap-3">
							<Languages className="w-4 h-4" />
							<span className="text-sm">{t("language")}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<span
								className={`text-xs px-1.5 py-0.5 rounded font-medium transition-colors ${
									locale === "en" ? "bg-ubuntu-orange text-white" : "opacity-40"
								}`}
							>
								EN
							</span>
							<span
								className={`text-xs px-1.5 py-0.5 rounded font-medium transition-colors ${
									locale === "id" ? "bg-ubuntu-orange text-white" : "opacity-40"
								}`}
							>
								ID
							</span>
						</div>
					</MenuItem>

					{/* Spotify now playing */}
					{track && (
						<>
							<Divider />
							<SpotifyPanel track={track} />
						</>
					)}

					<Divider />

					<SystemInfo
						ping={ping}
						batteryLevel={level}
						charging={charging}
						t={t}
					/>
				</div>
			)}
		</div>
	);
}
