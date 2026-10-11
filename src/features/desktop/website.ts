"use client";

import { useCallback } from "react";
import { isAppId } from "@/config/apps";
import { useRouter } from "@/i18n/navigation";
import { websitePath } from "@/lib/desktop-links";
import { rememberUiMode } from "@/lib/ui-mode";
import { useContentSelection } from "@/store/useContentSelection";
import { useWindowStore } from "@/store/useWindowStore";
import type { WindowState } from "@/types/app";

/** The app in front, unless everything is minimized. */
function frontApp(windows: WindowState[], activeId: string | null) {
	const win = windows.find((w) => w.id === activeId && !w.minimized);
	return win && isAppId(win.appId) ? win.appId : null;
}

/** The website page for whatever is in front (and the article it shows). */
export function useWebsitePath() {
	const app = useWindowStore((s) => frontApp(s.windows, s.activeWindowId));
	const item = useContentSelection((s) => (app ? s.shown[app] : undefined));
	return websitePath(app, item);
}

/** Leave the desktop for the website, for actions that aren't links. */
export function useOpenWebsite() {
	const router = useRouter();
	return useCallback(() => {
		const { windows, activeWindowId } = useWindowStore.getState();
		const app = frontApp(windows, activeWindowId);
		const item = app ? useContentSelection.getState().shown[app] : undefined;
		rememberUiMode("classic");
		router.push(websitePath(app, item));
	}, [router]);
}
