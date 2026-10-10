"use client";

import type { AppConfig } from "@/config/apps";
import { cn } from "@/lib/utils";

interface DockIconProps {
	app: AppConfig;
	label: string;
	/** A window exists (even minimized) → show the running dot. */
	isRunning: boolean;
	onClick: () => void;
	className?: string;
}

export function DockIcon({
	app: { icon: Icon, color },
	label,
	isRunning,
	onClick,
	className,
}: DockIconProps) {
	return (
		<div className={cn("relative flex flex-col items-center pb-2", className)}>
			<button
				type="button"
				onClick={onClick}
				aria-label={label}
				className={cn(
					"group w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform duration-150 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
					color,
				)}
			>
				<Icon size={24} strokeWidth={2} aria-hidden />
				<DockTooltip>{label}</DockTooltip>
			</button>

			<span
				aria-hidden
				className={cn(
					"absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-opacity",
					isRunning ? "opacity-100" : "opacity-0",
				)}
			/>
		</div>
	);
}

export function DockTooltip({ children }: { children: string }) {
	return (
		<span
			aria-hidden
			className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 rounded text-xs whitespace-nowrap bg-black text-white border border-white/10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none z-50 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black"
		>
			{children}
		</span>
	);
}
