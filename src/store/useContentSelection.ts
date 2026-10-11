import { create } from "zustand";
import type { AppId } from "@/config/apps";

interface ContentSelectionStore {
	/** An item a deep link asked for, waiting for its window to show it. */
	requested: { app: AppId; slug: string } | null;
	/** The item each content window shows right now (absent = its list). */
	shown: Partial<Record<AppId, string>>;
	request: (app: AppId, slug: string) => void;
	clearRequest: () => void;
	setShown: (app: AppId, slug: string | null) => void;
}

/**
 * Which project or post the Projects and Blog windows show, so the website
 * and the desktop can hand the reader over to each other mid-article.
 */
export const useContentSelection = create<ContentSelectionStore>((set) => ({
	requested: null,
	shown: {},
	request: (app, slug) => set({ requested: { app, slug } }),
	clearRequest: () => set({ requested: null }),
	setShown: (app, slug) =>
		set((s) => {
			if ((s.shown[app] ?? null) === slug) return s;
			const { [app]: _, ...rest } = s.shown;
			return { shown: slug ? { ...rest, [app]: slug } : rest };
		}),
}));
