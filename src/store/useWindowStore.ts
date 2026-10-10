import { create } from "zustand";
import {
	FALLBACK_TITLES,
	WINDOW_BASE_Z_INDEX,
	WINDOW_OFFSET_X,
	WINDOW_OFFSET_Y,
	WINDOW_STAGGER,
} from "@/constants/window";
import {
	isProjectWindow,
	type WindowPayload,
	type WindowState,
} from "@/types/app";

interface WindowStore {
	// State
	windows: WindowState[];
	activeWindowId: string | null;
	zCounter: number;

	// Window actions
	openWindow: (appId: string, data?: WindowPayload) => void;
	closeWindow: (id: string) => void;
	minimizeWindow: (id: string) => void;
	toggleMaximize: (id: string) => void;
	minimizeAllWindows: () => void;
	bringToFront: (id: string) => void;
	updatePosition: (id: string, x: number, y: number) => void;
	setSnapZone: (id: string, zone: WindowState["snapZone"]) => void;
	setActiveWindow: (id: string | null) => void;
	handleDockClick: (appId: string) => void;

	// Derived — computed dari windows
	getOpenApps: () => { id: string; name: string }[];
	getActiveApp: () => { id: string; name: string } | null;
	getEffectiveZ: (win: WindowState) => number;
}

function deriveTitle(appId: string, data?: WindowPayload): string {
	if (data?.kind === "project") return `${data.emoji} ${data.title}`;
	return FALLBACK_TITLES[appId] ?? appId;
}

function getIsMobile() {
	if (typeof window === "undefined") return false;
	return window.innerWidth < 768;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
	windows: [],
	activeWindowId: null,
	zCounter: WINDOW_BASE_Z_INDEX,

	openWindow: (appId, data) => {
		const { windows, zCounter } = get();
		const existing = windows.find((w) => w.appId === appId);

		if (existing) {
			set((s) => ({
				zCounter: s.zCounter + 1,
				activeWindowId: existing.id,
				windows: s.windows.map((w) =>
					w.id === existing.id
						? // keep the payload when re-opened without one (dock/terminal)
							{
								...w,
								minimized: false,
								data: data ?? w.data,
								zIndex: s.zCounter + 1,
							}
						: w,
				),
			}));
			return;
		}

		const id = `${appId}-${Date.now()}`;
		const isMobile = getIsMobile();
		const visibleCount = windows.filter((w) => !w.minimized).length;
		const newZ = zCounter + 1;

		const newWindow: WindowState = {
			id,
			appId,
			title: deriveTitle(appId, data),
			data,
			minimized: false,
			maximized: isMobile,
			snapZone: null,
			position: {
				x: WINDOW_OFFSET_X + visibleCount * WINDOW_STAGGER,
				y: WINDOW_OFFSET_Y + visibleCount * WINDOW_STAGGER,
			},
			zIndex: newZ,
		};

		set((s) => ({
			zCounter: newZ,
			windows: [...s.windows, newWindow],
			activeWindowId: id,
		}));
	},

	closeWindow: (id) => {
		set((s) => ({
			windows: s.windows.filter((w) => w.id !== id),
			activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
		}));
	},

	minimizeWindow: (id) => {
		set((s) => ({
			windows: s.windows.map((w) =>
				w.id === id ? { ...w, minimized: true } : w,
			),
			activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
		}));
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
			windows: s.windows.map((w) => ({ ...w, minimized: true })),
			activeWindowId: null,
		}));
	},

	bringToFront: (id) => {
		set((s) => {
			const newZ = s.zCounter + 1;
			return {
				zCounter: newZ,
				activeWindowId: id,
				windows: s.windows.map((w) =>
					w.id === id ? { ...w, zIndex: newZ } : w,
				),
			};
		});
	},

	updatePosition: (id, x, y) => {
		set((s) => ({
			windows: s.windows.map((w) =>
				w.id === id ? { ...w, position: { x, y } } : w,
			),
		}));
	},

	setSnapZone: (id, zone) => {
		set((s) => ({
			windows: s.windows.map((w) =>
				w.id === id ? { ...w, snapZone: zone } : w,
			),
		}));
	},

	setActiveWindow: (id) => {
		set({ activeWindowId: id });
	},

	handleDockClick: (appId) => {
		const {
			windows,
			activeWindowId,
			openWindow,
			bringToFront,
			minimizeWindow,
		} = get();
		const win = windows.find((w) => w.appId === appId);

		if (!win) {
			openWindow(appId);
			return;
		}

		if (win.minimized) {
			bringToFront(win.id);
			set((s) => ({
				windows: s.windows.map((w) =>
					w.id === win.id ? { ...w, minimized: false } : w,
				),
			}));
			return;
		}

		if (activeWindowId === win.id) {
			minimizeWindow(win.id);
			return;
		}

		bringToFront(win.id);
	},

	// Derived
	getOpenApps: () => {
		return get().windows.map((w) => ({ id: w.id, name: w.title }));
	},

	getActiveApp: () => {
		const { windows, activeWindowId } = get();
		if (windows.length === 0) return null;
		const active = windows.find((w) => w.id === activeWindowId);
		return active ? { id: active.id, name: active.title } : null;
	},

	getEffectiveZ: (win) => {
		// A project window must stay above the Projects list that opened it —
		// but NOT above every other app (the old flat +500 buried any window
		// opened later, e.g. Blog, underneath an open README).
		if (!isProjectWindow(win.appId)) return win.zIndex;
		const list = get().windows.find((w) => w.appId === "projects");
		return list ? Math.max(win.zIndex, list.zIndex + 1) : win.zIndex;
	},
}));
