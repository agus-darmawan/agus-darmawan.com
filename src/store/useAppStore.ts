import { create } from "zustand";
import type { OpenApp } from "@/types/app";

interface AppStoreState {
	openApps: OpenApp[];
	activeWindowId: string | null;
	addApp: (app: Omit<OpenApp, "openedAt">) => void;
	removeApp: (appId: string) => void;
	clearApps: () => void;
	setActiveApp: (id: string | null) => void;
	getActiveApp: () => OpenApp | null;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
	openApps: [],
	activeWindowId: null,

	addApp: (app) =>
		set((state) => ({
			openApps: [
				...state.openApps.filter((a) => a.id !== app.id),
				{ ...app, openedAt: Date.now() },
			],
		})),

	removeApp: (appId) =>
		set((state) => ({
			openApps: state.openApps.filter((a) => a.id !== appId),
			activeWindowId:
				state.activeWindowId === appId ? null : state.activeWindowId,
		})),

	clearApps: () => set({ openApps: [], activeWindowId: null }),

	setActiveApp: (id) => set({ activeWindowId: id }),

	getActiveApp: () => {
		const { openApps, activeWindowId } = get();
		if (openApps.length === 0) return null;
		if (activeWindowId) {
			const found = openApps.find((a) => a.id === activeWindowId);
			if (found) return found;
		}
		return openApps.reduce((latest, app) =>
			app.openedAt > latest.openedAt ? app : latest,
		);
	},
}));
