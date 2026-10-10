"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useSwitchLocale } from "@/hooks/useSwitchLocale";
import { fetchJson } from "@/lib/fetch-json";
import { useWindowStore } from "@/store/useWindowStore";
import type { ApiResponse } from "@/types/api";
import type { Effect } from "./lib/commands";
import { mkLine } from "./lib/lines";
import { useTerminalStore } from "./terminal.store";

/** "up 1:07" — how long this tab has been open. */
function sessionUptime() {
	const minutes = Math.floor(performance.now() / 60_000);
	return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

/**
 * Applies what a command asks of the outside world: windows, theme,
 * language, vim, async lookups. Keeps `commands.ts` pure and testable.
 */
export function useTerminalEffects() {
	const t = useTranslations("TerminalWindow");
	const tApps = useTranslations("Dock");
	const { setTheme } = useTheme();
	const { switchLocale } = useSwitchLocale();

	return useCallback(
		(effect: Effect | undefined) => {
			if (!effect) return;
			const terminal = useTerminalStore.getState();
			const windows = useWindowStore.getState();

			switch (effect.type) {
				case "clear":
					terminal.clear();
					break;
				case "exit":
					terminal.reset();
					windows.closeApp("terminal");
					break;
				case "open":
					windows.openWindow(effect.app);
					break;
				case "close": {
					const closed = effect.app
						? windows.closeApp(effect.app) && effect.app
						: windows.closeTopWindow("terminal");
					terminal.print(
						closed
							? mkLine("output", t("closed", { app: tApps(closed) }))
							: mkLine("error", t("noWindow")),
					);
					break;
				}
				case "theme":
					setTheme(effect.mode);
					break;
				case "lang":
					switchLocale(effect.locale);
					break;
				case "vim":
					terminal.openVim(effect.dir, effect.filename, effect.content);
					break;
				case "uptime": {
					const line = mkLine("output", t("fetching"));
					terminal.print(line);
					const base = `up ${sessionUptime()}`;
					const load = "load average: 0.42, 0.38, 0.35";
					fetchJson<ApiResponse<{ count: number }>>("/api/visitors", {
						timeoutMs: 8_000,
					})
						.then((res) => {
							const visitors = res.data?.count;
							useTerminalStore
								.getState()
								.updateLine(
									line.id,
									visitors === undefined
										? `${base}, 1 user, ${load}`
										: `${base}, ${visitors.toLocaleString("en-US")} visitors (30d), ${load}`,
								);
						})
						.catch(() => {
							useTerminalStore
								.getState()
								.updateLine(line.id, `${base}, 1 user, ${load}`);
						});
					break;
				}
			}
		},
		[setTheme, switchLocale, t, tApps],
	);
}
