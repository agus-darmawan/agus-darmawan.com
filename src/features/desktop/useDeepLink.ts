"use client";

import { useEffect } from "react";
import { parseDeepLink } from "@/lib/desktop-links";
import { useContentSelection } from "@/store/useContentSelection";
import { useWindowStore } from "@/store/useWindowStore";

/**
 * Opens the window a website page linked to (`?open=projects&item=…`), then
 * tidies the address bar. Runs during the boot screen too: the window is
 * already there when the desktop appears.
 */
export function useDeepLink() {
	useEffect(() => {
		const link = parseDeepLink(window.location.search);
		if (!link) return;
		if (link.item) useContentSelection.getState().request(link.app, link.item);
		useWindowStore.getState().openWindow(link.app);
		window.history.replaceState(null, "", window.location.pathname);
	}, []);
}
