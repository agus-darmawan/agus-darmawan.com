import type { ReactNode } from "react";

export interface WindowHeroProps {
	accent: string;
	/** Optional second gradient stop for the top bar (blog: orange → aubergine). */
	accentTo?: string;
	icon: ReactNode;
	title: string;
	subtitle?: string;
	description?: string;
	stats?: { value: number; label: string }[];
	decoration?: "arcs" | "hatch";
	children?: ReactNode;
}

/**
 * Header block shared by the list windows (Projects, Blog). It used to be
 * ~150 lines copy-pasted per window with only colors and icons changed.
 */
export function WindowHero({
	accent,
	accentTo,
	icon,
	title,
	subtitle,
	description,
	stats = [],
	decoration = "arcs",
	children,
}: WindowHeroProps) {
	return (
		<div className="shrink-0 border-b border-(--border) relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none transition-all duration-300"
				style={{
					background: `linear-gradient(90deg, ${accent} 0%, ${accentTo ?? `${accent}60`} 55%, transparent 100%)`,
				}}
			/>

			{decoration === "arcs" ? (
				<svg
					className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-50"
					width="100"
					height="100%"
					aria-hidden="true"
					preserveAspectRatio="none"
				>
					{[20, 40, 60, 80].map((r) => (
						<circle
							key={r}
							cx="100"
							cy="50%"
							r={r}
							fill="none"
							stroke="var(--border)"
							strokeWidth="1"
						/>
					))}
				</svg>
			) : (
				<svg
					className="absolute top-0 right-0 pointer-events-none"
					width="140"
					height="130"
					aria-hidden="true"
				>
					{Array.from({ length: 10 }, (_, i) => i * 15).map((offset) => (
						<line
							key={offset}
							x1={140 - offset}
							y1={0}
							x2={140}
							y2={offset}
							stroke="var(--border)"
							strokeWidth="1"
						/>
					))}
				</svg>
			)}

			<div
				aria-hidden="true"
				className="absolute bottom-0 left-0 w-[110px] h-[70px] pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)",
					backgroundSize: "13px 13px",
					maskImage:
						"linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 65%)",
					WebkitMaskImage:
						"linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 65%)",
				}}
			/>

			<div
				aria-hidden="true"
				className="absolute bottom-0 left-0 right-0 h-px pointer-events-none transition-all duration-300"
				style={{
					background: `linear-gradient(90deg, ${accent}66, transparent 60%)`,
				}}
			/>

			<div className="relative z-1 px-5 pt-5 pb-4">
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-center gap-3">
						<div className="relative">
							<div
								aria-hidden="true"
								className="absolute inset-0 rounded-xl blur-sm pointer-events-none transition-colors duration-300"
								style={{ background: `${accent}55` }}
							/>
							<div
								className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors duration-300"
								style={{ background: accent }}
							>
								{icon}
							</div>
						</div>
						<div>
							<h1 className="text-base font-bold leading-tight text-(--text-primary)">
								{title}
							</h1>
							{subtitle && (
								<p className="text-[11px] text-(--text-muted)">{subtitle}</p>
							)}
						</div>
					</div>

					{stats.length > 0 && (
						<dl className="flex items-center gap-2 shrink-0">
							{stats.map((s, i) => (
								<div key={s.label} className="flex items-center gap-2">
									{i > 0 && (
										<span className="w-px h-6 rounded-full bg-(--border)" />
									)}
									<div
										className="text-center px-2.5 py-1 rounded-lg border"
										style={{
											background: `${accent}14`,
											borderColor: `${accent}33`,
										}}
									>
										<dd className="text-sm font-bold tabular-nums leading-none text-(--text-primary)">
											{s.value}
										</dd>
										<dt className="text-[9px] uppercase tracking-wide mt-0.5 text-(--text-muted)">
											{s.label}
										</dt>
									</div>
								</div>
							))}
						</dl>
					)}
				</div>

				{description && (
					<p className="text-xs leading-relaxed mb-4 text-(--text-secondary)">
						{description}
					</p>
				)}

				{children}
			</div>
		</div>
	);
}
