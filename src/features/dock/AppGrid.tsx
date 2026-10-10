"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { APPS } from "@/config/apps";

interface AppGridProps {
	runningApps: string[];
	onAppClick: (id: string) => void;
	onClose: () => void;
}

export function AppGrid({ runningApps, onAppClick, onClose }: AppGridProps) {
	const t = useTranslations("Dock");
	const [query, setQuery] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const id = requestAnimationFrame(() => searchRef.current?.focus());
		return () => cancelAnimationFrame(id);
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	const needle = query.trim().toLowerCase();
	const filtered = APPS.filter((app) =>
		t(app.id).toLowerCase().includes(needle),
	);

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label={t("launcherOpen")}
			className="fixed inset-0 z-30 flex flex-col items-center pt-16 pb-24 animate-fade-in bg-[rgba(8,4,6,0.92)] backdrop-blur-xl"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			onKeyDown={(e) => {
				if (
					e.key === "Enter" &&
					e.target === searchRef.current &&
					filtered[0]
				) {
					onAppClick(filtered[0].id);
				}
			}}
		>
			<div className="relative w-full max-w-md px-4 mb-10 mt-4">
				<Search
					aria-hidden
					className="absolute left-7.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
				/>
				<input
					ref={searchRef}
					type="search"
					aria-label={t("search")}
					placeholder={t("search")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none bg-white/8 border border-white/15 text-white/90 focus:border-ubuntu-orange/70 [&::-webkit-search-cancel-button]:hidden"
				/>
				{query && (
					<button
						type="button"
						title={t("clearSearch")}
						aria-label={t("clearSearch")}
						onClick={() => {
							setQuery("");
							searchRef.current?.focus();
						}}
						className="absolute right-7 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
					>
						<X size={14} aria-hidden />
					</button>
				)}
			</div>

			{filtered.length > 0 ? (
				<ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 px-6 w-full max-w-3xl">
					{filtered.map(({ id, icon: Icon, color }) => (
						<li key={id}>
							<button
								type="button"
								onClick={() => onAppClick(id)}
								className="w-full flex flex-col items-center gap-2 p-3 rounded-xl transition-colors hover:bg-white/8 focus-visible:bg-white/8 outline-none"
							>
								<span
									className={`relative w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg`}
								>
									<Icon size={28} className="text-white" aria-hidden />
									{runningApps.includes(id) && (
										<span
											aria-hidden
											className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
										/>
									)}
								</span>
								<span className="text-xs text-center leading-tight text-white/80">
									{t(id)}
								</span>
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="text-sm mt-8 text-white/40">{t("noResults")}</p>
			)}
		</div>
	);
}
