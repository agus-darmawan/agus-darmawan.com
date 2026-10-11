export type SnapZone = "left" | "right" | "full" | null;

export interface WindowState {
	id: string;
	appId: string;
	minimized: boolean;
	maximized: boolean;
	position: { x: number; y: number };
	snapZone: SnapZone;
	zIndex: number;
}
