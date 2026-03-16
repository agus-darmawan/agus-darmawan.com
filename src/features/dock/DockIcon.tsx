"use client";

import type { AppConfig } from "@/types/app";

interface DockIconProps {
	app: AppConfig;
	label: string;
	isRunning: boolean; // window exists (not closed) → show dot even when minimized
	isActive: boolean; // window is currently focused → show ring
	onClick: () => void;
	className?: string;
}

export function DockIcon({
	app,
	label,
	isRunning,
	isActive,
	onClick,
	className = "",
}: DockIconProps) {
	const { icon: Icon, color } = app;

	return (
		<div className={`relative flex flex-col items-center pb-2 ${className}`}>
			<button
				type="button"
				onClick={onClick}
				aria-label={label}
				className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white transition-transform duration-150 hover:scale-110 active:scale-95 group`}
				style={{
					outline: isActive ? "2px solid rgba(255,255,255,0.6)" : "none",
					outlineOffset: "2px",
					boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
				}}
			>
				<Icon size={24} strokeWidth={2} />

				{/* Tooltip */}
				<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 rounded text-xs whitespace-nowrap bg-black text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
					{label}
					<span
						className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
						style={{
							borderLeft: "4px solid transparent",
							borderRight: "4px solid transparent",
							borderTop: "4px solid black",
						}}
					/>
				</span>
			</button>

			{/* Running dot — visible whenever app is open (even minimized), hidden only when closed */}
			<span
				className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
				style={{ opacity: isRunning ? 1 : 0 }}
				aria-hidden
			/>
		</div>
	);
}
