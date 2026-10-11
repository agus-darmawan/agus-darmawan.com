/**
 * Which view a visitor picked: the classic website or the Ubuntu desktop.
 *
 * The choice lives in a first-party cookie so the bare domain opens the view
 * they used last (see proxy.ts). Explicit URLs always render what they name,
 * and crawlers never carry the cookie, so they always get the website.
 * Kept free of app imports: the proxy bundle includes this file.
 */
export const UI_MODE_COOKIE = "ui-mode";

export type UiMode = "classic" | "desktop";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Remember an explicit choice. Client-only. */
export function rememberUiMode(mode: UiMode) {
	const secure = window.location.protocol === "https:" ? "; Secure" : "";
	// biome-ignore lint/suspicious/noDocumentCookie: one plain preference cookie; the Cookie Store API isn't available in every browser yet
	document.cookie = `${UI_MODE_COOKIE}=${mode}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;
}
