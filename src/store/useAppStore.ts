import { create } from "zustand";
import type { OpenApp } from "@/types/app";

interface AppStoreState {
	openApps: OpenApp[];
	/** Register an open app. If the same id already exists it gets refreshed to the top. */
	addApp: (app: Omit<OpenApp, "openedAt">) => void;
	/** Unregister a closed app. */
	removeApp: (appId: string) => void;
	clearApps: () => void;
	/** Returns the app with the latest openedAt timestamp. */
	getLastOpenedApp: () => OpenApp | null;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
	openApps: [],

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
		})),

	clearApps: () => set({ openApps: [] }),

	getLastOpenedApp: () => {
		const apps = get().openApps;
		if (apps.length === 0) return null;
		return apps.reduce((latest, app) =>
			app.openedAt > latest.openedAt ? app : latest,
		);
	},
}));
