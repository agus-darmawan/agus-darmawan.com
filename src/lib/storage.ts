/**
 * Web Storage that never throws. Safari private mode, blocked cookies and
 * sandboxed iframes make `localStorage` / `sessionStorage` throw on access,
 * which used to crash the whole desktop on boot.
 */
type Area = "local" | "session";

function area(kind: Area): Storage | null {
	try {
		return kind === "local" ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}

export const storage = {
	get(kind: Area, key: string): string | null {
		try {
			return area(kind)?.getItem(key) ?? null;
		} catch {
			return null;
		}
	},
	set(kind: Area, key: string, value: string): void {
		try {
			area(kind)?.setItem(key, value);
		} catch {
			// Quota exceeded or storage disabled — the flag just won't persist.
		}
	},
};
