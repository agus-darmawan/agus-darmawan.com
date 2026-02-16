// components/ui/DockIcon.tsx
"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

interface DockIconProps {
	name: string;
	Icon: LucideIcon;
	color: string;
	isOpen: boolean;
	isActive: boolean;
	onClick: () => void;
}

export function DockIcon({
	name,
	Icon,
	color,
	isOpen,
	isActive,
	onClick,
}: DockIconProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`relative w-14 h-14 ${color} rounded-lg flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg group ${
				isActive ? "ring-2 ring-white/50" : ""
			}`}
			title={name}
		>
			<Icon size={26} strokeWidth={isActive ? 2.5 : 2} />

			{isOpen && (
				<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full shadow-lg"></div>
			)}

			<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1d1d1d] text-white px-3 py-1.5 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
				{name}
				<div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
					<div className="w-2 h-2 bg-[#1d1d1d] rotate-45"></div>
				</div>
			</div>
		</button>
	);
}
