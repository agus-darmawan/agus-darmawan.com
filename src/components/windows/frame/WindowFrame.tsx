"use client";

import React, { type ReactNode } from "react";
import type { WindowState } from "@/types/app";
import { WindowHeader } from "./WindowHeader";

interface WindowFrameProps {
	window: WindowState;
	isActive: boolean;
	isDragging: boolean;
	children: ReactNode;
	onMouseDown: (e: React.MouseEvent) => void;
	onClick: () => void;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

/**
 * WindowFrame — draggable, resizable window shell with macOS-style
 * traffic-light controls. Supports maximized/minimized states.
 */
export function WindowFrame({
	window: win,
	isActive,
	isDragging,
	children,
	onMouseDown,
	onClick,
	onClose,
	onMinimize,
	onMaximize,
}: WindowFrameProps) {
	if (win.minimized) return null;

	const positionStyle: React.CSSProperties = win.maximized
		? { top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }
		: {
				top: win.position.y,
				left: win.position.x,
				// Responsive: full width on small screens, fixed on desktop
				width: "clamp(320px, 90vw, 900px)",
				height: "clamp(400px, 80vh, 650px)",
			};

	return (
		<div
			className={[
				"absolute rounded-lg overflow-hidden flex flex-col transition-shadow duration-200",
				isDragging ? "cursor-grabbing select-none" : "",
				isActive ? "shadow-ubuntu-lg" : "shadow-ubuntu",
			]
				.filter(Boolean)
				.join(" ")}
			style={{
				...positionStyle,
				zIndex: win.zIndex,
			}}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			<WindowHeader
				title={win.title}
				isActive={isActive}
				isMaximized={win.maximized}
				onClose={onClose}
				onMinimize={onMinimize}
				onMaximize={onMaximize}
			/>

			<div
				className="flex-1 overflow-auto"
				style={{
					background: "var(--window-bg)",
					color: "var(--text-primary)",
				}}
			>
				{children}
			</div>
		</div>
	);
}
