"use client";

import { Languages, MoonIcon, SunIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
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

	const t = useTranslations("TopBar");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const { level, charging } = useBattery();
	const { ping } = usePing();
	const { track } = useSpotify();

	const isDark = theme === "dark";

	useClickOutside({ ref: menuRef, onOutside: () => setOpen(false) });

	const toggleTheme = () => setTheme(isDark ? "light" : "dark");

	const toggleLanguage = () => {
		router.push(pathname, { locale: locale === "en" ? "id" : "en" });
	};

	return (
		<div ref={menuRef} className="relative">
			<MenuTrigger open={open} onToggle={() => setOpen((v) => !v)} />

			{open && (
				<div className="absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-2rem)] bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50 text-white">
					{/* Theme toggle */}
					<MenuItem onClick={toggleTheme}>
						<div className="flex items-center gap-3">
							{isDark ? (
								<MoonIcon className="w-4 h-4" />
							) : (
								<SunIcon className="w-4 h-4" />
							)}
							<span className="text-sm">
								{isDark ? t("darkMode") : t("lightMode")}
							</span>
						</div>
						<TogglePill active={isDark} />
					</MenuItem>

					<Divider />

					<MenuItem onClick={toggleLanguage}>
						<div className="flex items-center gap-3">
							<Languages className="w-4 h-4" />
							<span className="text-sm">{t("language")}</span>
						</div>
						<span className="text-sm font-medium text-gray-400 uppercase">
							{locale}
						</span>
					</MenuItem>

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
