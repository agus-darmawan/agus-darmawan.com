"use client";

import { Maximize2, Minimize2, X } from "lucide-react";

interface WindowHeaderProps {
	title: string;
	isActive: boolean;
	isMaximized: boolean;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

/**
 * WindowHeader — macOS-style traffic-light title bar.
 * Draggable via .window-titlebar selector in useWindowManager.
 */
export function WindowHeader({
	title,
	isActive,
	isMaximized,
	onClose,
	onMinimize,
	onMaximize,
}: WindowHeaderProps) {
	return (
		<div
			className={[
				"window-titlebar h-9 flex items-center justify-between px-3 select-none shrink-0",
				!isMaximized ? "cursor-grab active:cursor-grabbing" : "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{
				background: isActive
					? "var(--window-header-active)"
					: "var(--window-header)",
				borderBottom: "1px solid var(--border)",
			}}
		>
			{/* Traffic lights + title */}
			<div className="flex items-center gap-2">
				<div className="flex gap-2">
					<TrafficButton
						color="#f46067"
						hoverColor="#f68086"
						label="Close"
						onClick={onClose}
						icon={<X size={10} />}
					/>
					<TrafficButton
						color="#f6a847"
						hoverColor="#f8b867"
						label="Minimize"
						onClick={onMinimize}
						icon={<Minimize2 size={8} />}
					/>
					<TrafficButton
						color="#64c550"
						hoverColor="#84d570"
						label={isMaximized ? "Restore" : "Maximize"}
						onClick={onMaximize}
						icon={<Maximize2 size={8} />}
					/>
				</div>

				<span
					className="text-sm font-medium ml-2 truncate max-w-48"
					style={{ color: "var(--text-primary)" }}
				>
					{title}
				</span>
			</div>
		</div>
	);
}

interface TrafficButtonProps {
	color: string;
	hoverColor: string;
	label: string;
	onClick: (e: React.MouseEvent) => void;
	icon: React.ReactNode;
}

function TrafficButton({
	color,
	hoverColor,
	label,
	onClick,
	icon,
}: TrafficButtonProps) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			onClick={(e) => {
				e.stopPropagation();
				onClick(e);
			}}
			className="w-4 h-4 rounded-full flex items-center justify-center group transition-colors"
			style={{ background: color }}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.background = hoverColor;
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.background = color;
			}}
		>
			<span className="text-[#2d0922] opacity-0 group-hover:opacity-100 transition-opacity">
				{icon}
			</span>
		</button>
	);
}
