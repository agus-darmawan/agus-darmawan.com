export interface OpenApp {
	id: string;
	name: string;
	icon?: string;
	type?: "document" | "app" | "browser";
	openedAt: number;
}
