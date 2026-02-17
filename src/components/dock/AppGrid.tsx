"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AppConfig, WindowState } from "@/types/app";

interface AppGridProps {
	apps: AppConfig[];
	windows: WindowState[];
	onAppClick: (id: string) => void;
	onClose: () => void;
	t: (key: string) => string;
}

/**
 * AppGrid — Ubuntu GNOME-style "Activities Overview" launcher.
 * Full-screen overlay with search bar and app grid.
 */
export function AppGrid({
	apps,
	windows,
	onAppClick,
	onClose,
	t,
}: AppGridProps) {
	const [query, setQuery] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);

	// Auto-focus search on mount
	useEffect(() => {
		const id = requestAnimationFrame(() => searchRef.current?.focus());
		return () => cancelAnimationFrame(id);
	}, []);

	// Close on Escape
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	const filtered = apps.filter((app) =>
		t(app.name).toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div
			className="fixed inset-0 z-30 flex flex-col items-center pt-16 pb-20 animate-fade-in"
			style={{
				background: "rgba(10, 5, 8, 0.88)",
				backdropFilter: "blur(24px)",
				WebkitBackdropFilter: "blur(24px)",
			}}
			// Click on backdrop = close
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			{/* Search bar */}
			<div className="relative w-full max-w-md mx-4 mb-10 mt-4">
				<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
				<input
					ref={searchRef}
					type="text"
					placeholder={t("search")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
					style={{
						background: "rgba(255,255,255,0.1)",
						border: "1px solid rgba(255,255,255,0.15)",
						color: "var(--panel-text)",
					}}
					onFocus={(e) => {
						e.currentTarget.style.background = "rgba(255,255,255,0.15)";
						e.currentTarget.style.borderColor = "rgba(233,84,32,0.6)";
					}}
					onBlur={(e) => {
						e.currentTarget.style.background = "rgba(255,255,255,0.1)";
						e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
					}}
				/>
				{query && (
					<button
						type="button"
						onClick={() => setQuery("")}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
						aria-label="Clear search"
					>
						<X size={14} />
					</button>
				)}
			</div>

			{/* App grid */}
			{filtered.length > 0 ? (
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 px-6 w-full max-w-3xl">
					{filtered.map((app) => {
						const win = windows.find((w) => w.appId === app.id);
						const isRunning = !!win;
						const { icon: Icon, color } = app;

						return (
							<button
								key={app.id}
								type="button"
								onClick={() => onAppClick(app.id)}
								className="dock-grid-item flex flex-col items-center gap-2 p-3 rounded-xl group"
								style={{
									transition: "background 0.15s ease",
								}}
								onMouseEnter={(e) => {
									(e.currentTarget as HTMLElement).style.background =
										"rgba(255,255,255,0.08)";
								}}
								onMouseLeave={(e) => {
									(e.currentTarget as HTMLElement).style.background =
										"transparent";
								}}
							>
								{/* Icon */}
								<div
									className={`relative w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg`}
								>
									<Icon size={28} className="text-white" />
									{/* Running dot */}
									{isRunning && (
										<span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
									)}
								</div>

								{/* Label */}
								<span
									className="text-xs text-center leading-tight"
									style={{ color: "rgba(255,255,255,0.85)" }}
								>
									{t(app.name)}
								</span>
							</button>
						);
					})}
				</div>
			) : (
				<div
					className="text-sm mt-8"
					style={{ color: "rgba(255,255,255,0.4)" }}
				>
					{t("noResults")}
				</div>
			)}
		</div>
	);
}
