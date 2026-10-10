import type { LucideIcon } from "lucide-react";

export interface AppConfig {
	id: string;
	name: string;
	icon: LucideIcon;
	color: string;
	category?: string;
}

export type SnapZone = "left" | "right" | "full" | null;

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
	snapZone: SnapZone;
	zIndex: number;
}
