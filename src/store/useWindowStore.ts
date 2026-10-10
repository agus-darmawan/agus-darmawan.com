import { create } from "zustand";
import {
	WINDOW_BASE_Z_INDEX,
	WINDOW_OFFSET_X,
	WINDOW_OFFSET_Y,
	WINDOW_STAGGER,
} from "@/constants/window";
import type { SnapZone, WindowState } from "@/types/app";

interface WindowStore {
	windows: WindowState[];
	activeWindowId: string | null;

	openWindow: (appId: string) => void;
	closeWindow: (id: string) => void;
	/** Close the top-most visible window, optionally skipping one app. */
	closeTopWindow: (exceptAppId?: string) => string | null;
	closeApp: (appId: string) => boolean;
	minimizeWindow: (id: string) => void;
	toggleMaximize: (id: string) => void;
	minimizeAllWindows: () => void;
	/** Raise + activate (+ restore). No-op when already the active top window. */
	focusWindow: (id: string) => void;
	updatePosition: (id: string, x: number, y: number) => void;
	setSnapZone: (id: string, zone: SnapZone) => void;
	handleDockClick: (appId: string) => void;
}

const isMobileViewport = () =>
	typeof window !== "undefined" && window.innerWidth < 768;

let idCounter = 0;
const nextId = (appId: string) => `${appId}-${++idCounter}`;

const byZ = (a: WindowState, b: WindowState) => a.zIndex - b.zIndex;

/**
 * Move `id` to the top and re-number every window from the base z-index.
 * z-indices stay in [BASE, BASE + n) instead of growing forever, so they
 * can never climb over the dock, menus or dialogs.
 */
function raise(windows: WindowState[], id: string): WindowState[] {
	const ordered = [...windows].sort(byZ);
	const target = ordered.findIndex((w) => w.id === id);
	if (target === -1) return windows;
	ordered.push(...ordered.splice(target, 1));
	const zOf = new Map(ordered.map((w, i) => [w.id, WINDOW_BASE_Z_INDEX + i]));
	return windows.map((w) => {
		const zIndex = zOf.get(w.id) ?? w.zIndex;
		return w.id === id
			? { ...w, zIndex, minimized: false }
			: zIndex === w.zIndex
				? w
				: { ...w, zIndex };
	});
}

const topVisible = (windows: WindowState[]) =>
	windows
		.filter((w) => !w.minimized)
		.sort(byZ)
		.at(-1) ?? null;

const patch = (
	windows: WindowState[],
	id: string,
	change: Partial<WindowState>,
) => windows.map((w) => (w.id === id ? { ...w, ...change } : w));

export const useWindowStore = create<WindowStore>((set, get) => ({
	windows: [],
	activeWindowId: null,

	openWindow: (appId) => {
		const { windows, focusWindow } = get();
		const existing = windows.find((w) => w.appId === appId);
		if (existing) {
			focusWindow(existing.id);
			return;
		}

		const visibleCount = windows.filter((w) => !w.minimized).length;
		const win: WindowState = {
			id: nextId(appId),
			appId,
			minimized: false,
			maximized: isMobileViewport(),
			snapZone: null,
			position: {
				x: WINDOW_OFFSET_X + visibleCount * WINDOW_STAGGER,
				y: WINDOW_OFFSET_Y + visibleCount * WINDOW_STAGGER,
			},
			zIndex: WINDOW_BASE_Z_INDEX + windows.length,
		};
		set({ windows: [...windows, win], activeWindowId: win.id });
	},

	closeWindow: (id) => {
		set((s) => {
			const windows = s.windows.filter((w) => w.id !== id);
			return {
				windows,
				activeWindowId:
					s.activeWindowId === id
						? (topVisible(windows)?.id ?? null)
						: s.activeWindowId,
			};
		});
	},

	closeTopWindow: (exceptAppId) => {
		const top = topVisible(
			get().windows.filter((w) => w.appId !== exceptAppId),
		);
		if (top) get().closeWindow(top.id);
		return top?.appId ?? null;
	},

	closeApp: (appId) => {
		const win = get().windows.find((w) => w.appId === appId);
		if (win) get().closeWindow(win.id);
		return Boolean(win);
	},

	minimizeWindow: (id) => {
		set((s) => {
			const windows = patch(s.windows, id, { minimized: true });
			return {
				windows,
				activeWindowId:
					s.activeWindowId === id
						? (topVisible(windows)?.id ?? null)
						: s.activeWindowId,
			};
		});
	},

	toggleMaximize: (id) => {
		set((s) => ({
			windows: s.windows.map((w) =>
				w.id === id
					? {
							...w,
							// A window snapped to the top edge is already full screen:
							// the button must restore it (it used to need two clicks).
							maximized: !(w.maximized || w.snapZone === "full"),
							snapZone: null,
						}
					: w,
			),
		}));
	},

	minimizeAllWindows: () => {
		set((s) => ({
			windows: s.windows.map((w) =>
				w.minimized ? w : { ...w, minimized: true },
			),
			activeWindowId: null,
		}));
	},

	focusWindow: (id) => {
		const { windows, activeWindowId } = get();
		const win = windows.find((w) => w.id === id);
		if (!win) return;
		const isTop = topVisible(windows)?.id === id;
		if (isTop && activeWindowId === id && !win.minimized) return;
		set({ windows: raise(windows, id), activeWindowId: id });
	},

	updatePosition: (id, x, y) => {
		set((s) => ({ windows: patch(s.windows, id, { position: { x, y } }) }));
	},

	setSnapZone: (id, zone) => {
		set((s) => ({ windows: patch(s.windows, id, { snapZone: zone }) }));
	},

	handleDockClick: (appId) => {
		const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow } =
			get();
		const win = windows.find((w) => w.appId === appId);

		if (!win) openWindow(appId);
		else if (!win.minimized && activeWindowId === win.id)
			minimizeWindow(win.id);
		else focusWindow(win.id);
	},
}));
