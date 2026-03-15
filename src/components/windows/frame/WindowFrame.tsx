"use client";

import React, { type ReactNode, useEffect, useState } from "react";
import type { WindowState } from "@/types/app";
import { WindowHeader } from "./WindowHeader";

interface WindowFrameProps {
	window: WindowState;
	isActive: boolean;
	isDragging: boolean;
	children: ReactNode;
	/** When true the close button shakes and refuses to close */
	closeLocked?: boolean;
	onMouseDown: (e: React.MouseEvent) => void;
	onClick: () => void;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	return isMobile;
}

export function WindowFrame({
	window: win,
	isActive,
	isDragging,
	children,
	closeLocked = false,
	onMouseDown,
	onClick,
	onClose,
	onMinimize,
	onMaximize,
}: WindowFrameProps) {
	const isMobile = useIsMobile();

	if (win.minimized) return null;

	const isFullscreen = win.maximized || isMobile;

	const positionStyle: React.CSSProperties = isFullscreen
		? { top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }
		: {
				top: win.position.y,
				left: win.position.x,
				width: "clamp(320px, 90vw, 900px)",
				height: "clamp(400px, 80vh, 650px)",
			};

	return (
		<div
			className={[
				"absolute rounded-lg overflow-hidden flex flex-col transition-shadow duration-200",
				isMobile ? "rounded-none" : "",
				isDragging && !isMobile ? "cursor-grabbing select-none" : "",
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
				isMaximized={isFullscreen}
				closeLocked={closeLocked}
				onClose={onClose}
				onMinimize={onMinimize}
				onMaximize={onMaximize}
				isMobile={isMobile}
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
