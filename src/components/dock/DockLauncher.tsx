"use client";

import { Grip, X } from "lucide-react";

interface DockLauncherProps {
	isOpen: boolean;
	onClick: () => void;
}

/**
 * DockLauncher — the Ubuntu-style "show all apps" button.
 * Sits at the left end of the dock.
 */
export function DockLauncher({ isOpen, onClick }: DockLauncherProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Show all applications"
			className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150 group"
			style={{
				background: isOpen ? "#e95420" : "rgba(255,255,255,0.08)",
			}}
			onMouseEnter={(e) => {
				if (!isOpen)
					(e.currentTarget as HTMLElement).style.background =
						"rgba(255,255,255,0.15)";
			}}
			onMouseLeave={(e) => {
				if (!isOpen)
					(e.currentTarget as HTMLElement).style.background =
						"rgba(255,255,255,0.08)";
			}}
		>
			{isOpen ? (
				<X size={18} className="text-white" />
			) : (
				<Grip size={30} className="text-white/75" />
			)}

			{/* Tooltip */}
			<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap bg-black text-white border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
				{isOpen ? "Close" : "Show Apps"}
			</span>
		</button>
	);
}
