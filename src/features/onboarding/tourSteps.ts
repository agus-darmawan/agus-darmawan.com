export interface TourStep {
	id: string;
	target: string | null; // CSS selector, null = centered modal step
	titleKey: string;
	bodyKey: string;
	placement: "top" | "bottom" | "center";
}

export const TOUR_STEPS: TourStep[] = [
	{
		id: "welcome",
		target: null,
		titleKey: "welcomeTitle",
		bodyKey: "welcomeBody",
		placement: "center",
	},
	{
		id: "dock",
		target: '[data-tour="dock"]',
		titleKey: "dockTitle",
		bodyKey: "dockBody",
		placement: "top",
	},
	{
		id: "topbar",
		target: '[data-tour="topbar"]',
		titleKey: "topbarTitle",
		bodyKey: "topbarBody",
		placement: "bottom",
	},
	{
		id: "shortcuts",
		target: null,
		titleKey: "shortcutsTitle",
		bodyKey: "shortcutsBody",
		placement: "center",
	},
];
