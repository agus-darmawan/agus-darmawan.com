import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface WindowHeroProps {
	accent: string;
	/** Optional second gradient stop for the top bar (blog: orange → aubergine). */
	accentTo?: string;
	icon: ReactNode;
	title: string;
	subtitle?: string;
	description?: string;
	stats?: { value: number; label: string }[];
	decoration?: "arcs" | "hatch" | "timeline" | "wave";
	children?: ReactNode;
}

const DOT_GRID: CSSProperties = {
	backgroundImage:
		"radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)",
	backgroundSize: "13px 13px",
	maskImage: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 65%)",
	WebkitMaskImage:
		"linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 65%)",
};

function Decoration({
	kind,
}: {
	kind: NonNullable<WindowHeroProps["decoration"]>;
}) {
	if (kind === "arcs") {
		return (
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
		);
	}

	if (kind === "hatch") {
		return (
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
		);
	}

	if (kind === "wave") {
		return (
			<svg
				className="absolute right-0 top-0 h-full pointer-events-none opacity-45"
				width="130"
				viewBox="0 0 130 120"
				preserveAspectRatio="xMaxYMid meet"
				aria-hidden="true"
			>
				{[0, 12, 24, 36, 48, 60, 72, 84, 96, 108].map((y, i) => (
					<line
						key={y}
						x1={130 - (i % 2 === 0 ? 20 : 40)}
						y1={y}
						x2={130}
						y2={y}
						stroke="var(--border)"
						strokeWidth="1"
					/>
				))}
				<path
					d="M130,0 Q110,30 130,60 Q110,90 130,120"
					fill="none"
					stroke="var(--border)"
					strokeWidth="1"
				/>
				<path
					d="M130,0 Q95,30 130,60 Q95,90 130,120"
					fill="none"
					stroke="var(--border)"
					strokeWidth="0.6"
					opacity="0.6"
				/>
			</svg>
		);
	}

	return (
		<svg
			className="absolute right-0 top-0 h-full pointer-events-none opacity-55"
			width="48"
			viewBox="0 0 48 120"
			preserveAspectRatio="xMaxYMid meet"
			aria-hidden="true"
		>
			<line
				x1="24"
				y1="0"
				x2="24"
				y2="120"
				stroke="var(--border)"
				strokeWidth="1"
				strokeDasharray="3 5"
			/>
			{[15, 35, 55, 75, 95].map((y) => (
				<line
					key={y}
					x1="24"
					y1={y}
					x2="40"
					y2={y}
					stroke="var(--border)"
					strokeWidth="1"
				/>
			))}
			{[35, 55, 75, 95].map((y) => (
				<circle
					key={y}
					cx="24"
					cy={y}
					r="3"
					fill="none"
					stroke="var(--border)"
					strokeWidth="1"
				/>
			))}
			<circle cx="24" cy="15" r="4" fill="var(--hero)" opacity="0.7" />
			<circle
				cx="24"
				cy="15"
				r="7"
				fill="none"
				stroke="var(--hero)"
				strokeWidth="1"
				opacity="0.3"
			/>
		</svg>
	);
}

/**
 * Header block shared by the list windows (Projects, Blog, Experience). It
 * used to be ~150 lines copy-pasted per window with only colors changed.
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
		<div
			style={
				{
					"--hero": accent,
					"--hero-to":
						accentTo ?? `color-mix(in srgb, ${accent} 38%, transparent)`,
				} as CSSProperties
			}
			className="shrink-0 border-b border-(--border) relative overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none bg-linear-to-r from-(--hero) via-(--hero-to) via-55% to-transparent"
			/>
			<Decoration kind={decoration} />
			<div
				aria-hidden="true"
				className="absolute bottom-0 left-0 w-[110px] h-[70px] pointer-events-none"
				style={DOT_GRID}
			/>
			<div
				aria-hidden="true"
				className="absolute bottom-0 left-0 right-0 h-px pointer-events-none bg-linear-to-r from-(--hero)/40 to-transparent to-60%"
			/>

			<div className="relative z-1 px-5 pt-5 pb-4">
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-center gap-3">
						<div className="relative">
							<div
								aria-hidden="true"
								className="absolute inset-0 rounded-xl blur-sm pointer-events-none transition-colors duration-300 bg-(--hero)/35"
							/>
							<div className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors duration-300 bg-(--hero)">
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
							{stats.map((stat, index) => (
								<div key={stat.label} className="flex items-center gap-2">
									{index > 0 && (
										<span
											aria-hidden="true"
											className="w-px h-6 rounded-full bg-(--border)"
										/>
									)}
									{/* dt before dd (valid <dl>), value shown on top. */}
									<div className="flex flex-col-reverse text-center px-2.5 py-1 rounded-lg border bg-(--hero)/8 border-(--hero)/20">
										<dt className="text-[9px] uppercase tracking-wide mt-0.5 text-(--text-muted)">
											{stat.label}
										</dt>
										<dd className="text-sm font-bold tabular-nums leading-none text-(--text-primary)">
											{stat.value}
										</dd>
									</div>
								</div>
							))}
						</dl>
					)}
				</div>

				{description && (
					<p
						className={cn(
							"text-xs leading-relaxed text-(--text-secondary)",
							children && "mb-4",
						)}
					>
						{description}
					</p>
				)}

				{children}
			</div>
		</div>
	);
}
