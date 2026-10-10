import type { LucideIcon } from "lucide-react";

export interface AppConfig {
	id: string;
	name: string;
	icon: LucideIcon;
	color: string;
	category?: string;
}

/** Project detail windows use the app id `project-{slug}`. */
export const PROJECT_WINDOW_PREFIX = "project-";
export const projectWindowId = (slug: string) =>
	`${PROJECT_WINDOW_PREFIX}${slug}`;
export const isProjectWindow = (appId: string) =>
	appId.startsWith(PROJECT_WINDOW_PREFIX);

export type WindowPayload =
	| { kind: "project"; slug: string; title: string; emoji: string }
	| undefined;

export interface WindowState {
	id: string;
	appId: string;
	title: string;
	minimized: boolean;
	maximized: boolean;
	position: {
		x: number;
		y: number;
	};
	snapZone: "left" | "right" | "full" | null;
	zIndex: number;
	data?: WindowPayload;
}
