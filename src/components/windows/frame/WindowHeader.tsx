"use client";

import { Maximize2, Minimize2, X } from "lucide-react";
import { useState } from "react";

interface WindowHeaderProps {
	title: string;
	isActive: boolean;
	isMaximized: boolean;
	isMobile?: boolean;
	/** When true, clicking close shakes the button instead of closing */
	closeLocked?: boolean;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

export function WindowHeader({
	title,
	isActive,
	isMaximized,
	isMobile = false,
	closeLocked = false,
	onClose,
	onMinimize,
	onMaximize,
}: WindowHeaderProps) {
	const draggable = !isMaximized && !isMobile;
	const [shaking, setShaking] = useState(false);

	const handleClose = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (closeLocked) {
			// Shake animation to indicate it's locked
			setShaking(true);
			setTimeout(() => setShaking(false), 500);
			onClose(); // still call so page.tsx can bring README to front
			return;
		}
		onClose();
	};

	return (
		<>
			{/* Inject shake keyframes once */}
			<style>{`
				@keyframes wm-shake {
					0%,100% { transform: translateX(0); }
					20%      { transform: translateX(-3px); }
					40%      { transform: translateX(3px); }
					60%      { transform: translateX(-2px); }
					80%      { transform: translateX(2px); }
				}
				.wm-shake { animation: wm-shake 0.45s ease; }
			`}</style>

			<div
				className={[
					"window-titlebar h-9 flex items-center justify-between px-3 select-none shrink-0",
					draggable ? "cursor-grab active:cursor-grabbing" : "",
					shaking ? "wm-shake" : "",
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
						{/* Close */}
						<TrafficButton
							color={closeLocked ? "#888888" : "#f46067"}
							hoverColor={closeLocked ? "#aaaaaa" : "#f68086"}
							label={closeLocked ? "Close (close README first)" : "Close"}
							onClick={handleClose}
							icon={<X size={10} />}
							dimmed={closeLocked}
						/>
						{/* Minimize */}
						<TrafficButton
							color="#f6a847"
							hoverColor="#f8b867"
							label="Minimize"
							onClick={(e) => {
								e.stopPropagation();
								onMinimize();
							}}
							icon={<Minimize2 size={8} />}
							disabled={isMobile}
						/>
						{/* Maximize */}
						<TrafficButton
							color="#64c550"
							hoverColor="#84d570"
							label={isMaximized ? "Restore" : "Maximize"}
							onClick={(e) => {
								e.stopPropagation();
								onMaximize();
							}}
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
		</>
	);
}

interface TrafficButtonProps {
	color: string;
	hoverColor: string;
	label: string;
	onClick: (e: React.MouseEvent) => void;
	icon: React.ReactNode;
	disabled?: boolean;
	dimmed?: boolean;
}

function TrafficButton({
	color,
	hoverColor,
	label,
	onClick,
	icon,
	disabled = false,
	dimmed = false,
}: TrafficButtonProps) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			disabled={disabled}
			onClick={onClick}
			className="w-4 h-4 rounded-full flex items-center justify-center group transition-colors disabled:opacity-30"
			style={{
				background: color,
				opacity: dimmed ? 0.5 : 1,
				cursor: dimmed ? "not-allowed" : "pointer",
			}}
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
