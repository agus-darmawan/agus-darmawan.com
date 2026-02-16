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

	const positionStyle = win.maximized
		? { top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }
		: {
				top: win.position.y,
				left: win.position.x,
				width: "900px",
				height: "650px",
			};

	return (
		<div
			className={[
				"absolute rounded-lg overflow-hidden flex flex-col transition-shadow duration-200",
				isDragging ? "cursor-grabbing" : "",
				isActive ? "shadow-ubuntu-lg" : "shadow-ubuntu",
			].join(" ")}
			style={{ ...positionStyle, zIndex: win.zIndex }}
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

			<div className="flex-1 overflow-hidden bg-(--window-bg)] text-(--text-primary)]">
				{children}
			</div>
		</div>
	);
}
