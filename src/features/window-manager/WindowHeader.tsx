"use client";

import { Maximize2, Minimize2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WindowHeaderProps {
	title: string;
	isActive: boolean;
	isMaximized: boolean;
	isMobile: boolean;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

export function WindowHeader({
	title,
	isActive,
	isMaximized,
	isMobile,
	onClose,
	onMinimize,
	onMaximize,
}: WindowHeaderProps) {
	const t = useTranslations("Window");
	const draggable = !isMaximized && !isMobile;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: double-click is a mouse shortcut; the maximize button is the accessible control
		<div
			className={cn(
				"window-titlebar h-9 flex items-center gap-2 px-3 select-none shrink-0 border-b border-(--border)",
				isActive ? "bg-(--window-header-active)" : "bg-(--window-header)",
				draggable && "cursor-grab active:cursor-grabbing",
			)}
			onDoubleClick={(e) => {
				if (!isMobile && !(e.target as HTMLElement).closest("button")) {
					onMaximize();
				}
			}}
		>
			<div className="flex gap-2">
				<TrafficButton
					className="bg-[#f46067] hover:bg-[#f68086]"
					label={t("close")}
					onClick={onClose}
					icon={<X size={10} />}
				/>
				<TrafficButton
					className="bg-[#f6a847] hover:bg-[#f8b867]"
					label={t("minimize")}
					onClick={onMinimize}
					icon={<Minimize2 size={8} />}
					disabled={isMobile}
				/>
				<TrafficButton
					className="bg-[#64c550] hover:bg-[#84d570]"
					label={isMaximized ? t("restore") : t("maximize")}
					onClick={onMaximize}
					icon={<Maximize2 size={8} />}
					disabled={isMobile}
				/>
			</div>

			<span className="text-sm font-medium ml-2 truncate max-w-48 text-(--text-primary)">
				{title}
			</span>
		</div>
	);
}

interface TrafficButtonProps {
	className: string;
	label: string;
	onClick: () => void;
	icon: ReactNode;
	disabled?: boolean;
}

function TrafficButton({
	className,
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
			onClick={(e: MouseEvent) => {
				// Don't let the frame's click handler re-focus a window being closed.
				e.stopPropagation();
				onClick();
			}}
			className={cn(
				"w-4 h-4 rounded-full flex items-center justify-center group transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
				className,
			)}
		>
			<span className="text-[#2d0922] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
				{icon}
			</span>
		</button>
	);
}
