"use client";

import { Grip } from "lucide-react";

interface DockLauncherProps {
	isOpen: boolean;
	onClick: () => void;
}

/**
 * DockLauncher — the Ubuntu-style "show all apps" button (hamburger/grid).
 * Sits at the left end of the dock.
 */
export function DockLauncher({ isOpen, onClick }: DockLauncherProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Show all applications"
			className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group ${
				isOpen
					? "bg-ubuntu-orange shadow-lg shadow-ubuntu-orange/30"
					: "bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/15"
			}`}
		>
			<Grip
				size={30}
				className={`transition-transform duration-200 ${
					isOpen ? "text-white rotate-45 scale-90" : ""
				}`}
				style={{ color: isOpen ? "white" : "var(--dock-text)" }}
			/>

			{/* Tooltip */}
			<div
				className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap
				opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl"
				style={{
					background: "var(--panel-bg)",
					color: "var(--panel-text)",
					border: "1px solid var(--panel-border)",
				}}
			>
				{isOpen ? "Close" : "Show Apps"}
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
