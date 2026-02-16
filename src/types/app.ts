import { type LucideIcon } from "lucide-react";

export interface OpenApp {
	id: string;
	name: string;
	icon?: string;
	type?: "document" | "app" | "browser";
	openedAt: number;
}

export interface AppConfig {
	id: string;
	name: string;
	icon: LucideIcon;
	color: string;
	category?: string;
}

export interface WindowState {
	id: string;
	appId: string;
	title: string;
	data?: TemplateStringsArray;
	minimized: boolean;
	maximized: boolean;
	position: { x: number; y: number };
	zIndex: number;
}
