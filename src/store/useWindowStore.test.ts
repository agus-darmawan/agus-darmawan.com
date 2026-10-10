import { beforeEach, describe, expect, it } from "vitest";
import { WINDOW_BASE_Z_INDEX } from "@/constants/window";
import { useWindowStore } from "./useWindowStore";

const store = () => useWindowStore.getState();
const byApp = (appId: string) => store().windows.find((w) => w.appId === appId);

describe("useWindowStore", () => {
	beforeEach(() =>
		useWindowStore.setState({ windows: [], activeWindowId: null }),
	);

	it("opens each app once and focuses it on reopen", () => {
		store().openWindow("about");
		store().openWindow("blog");
		store().openWindow("about");
		expect(store().windows).toHaveLength(2);
		expect(store().activeWindowId).toBe(byApp("about")?.id);
	});

	it("keeps z-indices bounded no matter how often windows are focused", () => {
		store().openWindow("about");
		store().openWindow("blog");
		for (let i = 0; i < 500; i++) {
			store().focusWindow(byApp(i % 2 ? "about" : "blog")!.id);
		}
		const zs = store()
			.windows.map((w) => w.zIndex)
			.sort();
		expect(zs).toEqual([WINDOW_BASE_Z_INDEX, WINDOW_BASE_Z_INDEX + 1]);
	});

	it("focusing the active top window is a no-op (no re-render)", () => {
		store().openWindow("about");
		const before = store().windows;
		store().focusWindow(byApp("about")!.id);
		expect(store().windows).toBe(before);
	});

	it("activates the next window after closing or minimizing the active one", () => {
		store().openWindow("about");
		store().openWindow("blog");
		store().closeWindow(byApp("blog")!.id);
		expect(store().activeWindowId).toBe(byApp("about")?.id);
		store().minimizeWindow(byApp("about")!.id);
		expect(store().activeWindowId).toBeNull();
	});

	it("closeTopWindow skips the excepted app", () => {
		store().openWindow("about");
		store().openWindow("terminal");
		expect(store().closeTopWindow("terminal")).toBe("about");
		expect(store().closeTopWindow("terminal")).toBeNull();
		expect(byApp("terminal")).toBeDefined();
	});

	it("dock click cycles open → minimize → restore", () => {
		store().handleDockClick("blog");
		expect(byApp("blog")?.minimized).toBe(false);
		store().handleDockClick("blog");
		expect(byApp("blog")?.minimized).toBe(true);
		store().handleDockClick("blog");
		expect(byApp("blog")?.minimized).toBe(false);
		expect(store().activeWindowId).toBe(byApp("blog")?.id);
	});

	it("maximize restores a window snapped full screen in one click", () => {
		store().openWindow("about");
		const id = byApp("about")!.id;
		store().setSnapZone(id, "full");
		store().toggleMaximize(id);
		expect(byApp("about")).toMatchObject({ maximized: false, snapZone: null });
	});
});
