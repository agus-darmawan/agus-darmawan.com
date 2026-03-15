"use client";

import { Maximize2, Minimize2, X } from "lucide-react";

interface WindowHeaderProps {
	title: string;
	isActive: boolean;
	isMaximized: boolean;
	isMobile?: boolean;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

export function WindowHeader({
	title,
	isActive,
	isMaximized,
	isMobile = false,
	onClose,
	onMinimize,
	onMaximize,
}: WindowHeaderProps) {
	const draggable = !isMaximized && !isMobile;

	return (
		<div
			className={[
				"window-titlebar h-9 flex items-center justify-between px-3 select-none shrink-0",
				draggable ? "cursor-grab active:cursor-grabbing" : "",
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
						disabled={isMobile}
					/>
					<TrafficButton
						color="#64c550"
						hoverColor="#84d570"
						label={isMaximized ? "Restore" : "Maximize"}
						onClick={onMaximize}
						icon={<Maximize2 size={8} />}
						disabled={isMobile}
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
	disabled?: boolean;
}

function TrafficButton({
	color,
	hoverColor,
	label,
	onClick,
	icon,
	disabled = false,
}: TrafficButtonProps) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			disabled={disabled}
			onClick={(e) => {
				e.stopPropagation();
				if (!disabled) onClick(e);
			}}
			className="w-4 h-4 rounded-full flex items-center justify-center group transition-colors disabled:opacity-30"
			style={{ background: color }}
			onMouseEnter={(e) => {
				if (!disabled)
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
