"use client";

import type { AppConfig } from "@/types/app";

interface DockIconProps {
	app: AppConfig;
	label: string;
	isOpen: boolean;
	isActive: boolean;
	onClick: () => void;
}

/**
 * DockIcon — individual app launcher icon in the dock.
 */
export function DockIcon({
	app,
	label,
	isOpen,
	isActive,
	onClick,
}: DockIconProps) {
	const { icon: Icon, color } = app;

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={`
				relative w-12 h-12 ${color} rounded-xl flex items-center justify-center
				text-white hover:scale-110 active:scale-95 transition-all duration-200
				shadow-lg group
				${isActive ? "ring-2 ring-white/40 ring-offset-1 ring-offset-transparent" : ""}
			`}
		>
			<Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

			{/* Running indicator dot */}
			{isOpen && (
				<span
					className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow"
					aria-hidden
				/>
			)}

			{/* Tooltip */}
			<div
				className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap
				opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-xl"
				style={{
					background: "var(--panel-bg)",
					color: "var(--panel-text)",
					border: "1px solid var(--panel-border)",
				}}
			>
				{label}
				<div
					className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
					style={{
						borderLeft: "4px solid transparent",
						borderRight: "4px solid transparent",
						borderTop: "4px solid var(--panel-bg)",
					}}
				/>
			</div>
		</button>
	);
}
