import { create } from "zustand";
import {
	FALLBACK_TITLES,
	WINDOW_BASE_Z_INDEX,
	WINDOW_OFFSET_X,
	WINDOW_OFFSET_Y,
	WINDOW_STAGGER,
} from "@/constants/window";
import type { WindowPayload, WindowState } from "@/types/app";

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
	setActiveWindow: (id: string | null) => void;
	handleDockClick: (appId: string) => void;

	// Derived — computed dari windows
	getOpenApps: () => { id: string; name: string }[];
	getActiveApp: () => { id: string; name: string } | null;
	getEffectiveZ: (win: WindowState) => number;
}

function deriveTitle(appId: string, data?: WindowPayload): string {
	if (appId.startsWith("readme-") && data?.kind === "readme") {
		return `${data.project.emoji} ${data.name}`;
	}
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
						? { ...w, minimized: false, data, zIndex: s.zCounter + 1 }
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
				w.id === id ? { ...w, maximized: !w.maximized } : w,
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

	// effectiveZ — README windows selalu di atas Projects
	getEffectiveZ: (win) => {
		return win.appId.startsWith("readme-") ? win.zIndex + 500 : win.zIndex;
	},
}));
