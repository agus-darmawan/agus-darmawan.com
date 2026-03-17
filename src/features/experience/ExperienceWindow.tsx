"use client";

import { useTranslations } from "next-intl";
import { ExperienceCard } from "./ExperienceCard";
import { EXPERIENCES } from "./experienceData";

export default function ExperienceWindow() {
	const t = useTranslations("ExperienceWindow");
	const tExp = useTranslations("Experience");

	const totalRoles = EXPERIENCES.reduce((acc, e) => acc + e.roles.length, 0);

	const translate = (key: string, values?: Record<string, string>) => {
		if (!values) return t(key);
		return t(key, values as Record<string, string>);
	};

	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* ── Header — sticky, tidak ikut scroll ─────────────── */}
			<div
				className="shrink-0 relative overflow-hidden border-b"
				style={{ borderColor: "var(--border)" }}
			>
				{/* Top accent bar — blue → teal */}
				<div
					className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
					style={{
						background:
							"linear-gradient(90deg, #0ea5e9 0%, #10b98170 55%, transparent 100%)",
					}}
				/>

				{/* Timeline dots decoration — kanan */}
				<svg
					className="absolute right-0 top-0 h-full pointer-events-none"
					width="48"
					viewBox="0 0 48 120"
					preserveAspectRatio="xMaxYMid meet"
					aria-hidden="true"
					style={{ opacity: 0.55 }}
				>
					{/* vertical dashed spine */}
					<line
						x1="24"
						y1="0"
						x2="24"
						y2="120"
						stroke="var(--border)"
						strokeWidth="1"
						strokeDasharray="3 5"
					/>
					{/* connector ticks */}
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
					{/* hollow circles */}
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
					{/* top filled dot — "now" */}
					<circle cx="24" cy="15" r="4" fill="#0ea5e9" opacity="0.7" />
					<circle
						cx="24"
						cy="15"
						r="7"
						fill="none"
						stroke="#0ea5e9"
						strokeWidth="1"
						opacity="0.3"
					/>
				</svg>

				{/* Dot grid — pojok kiri bawah */}
				<div
					className="absolute bottom-0 left-0 pointer-events-none"
					style={{
						width: "110px",
						height: "70px",
						backgroundImage:
							"radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)",
						backgroundSize: "13px 13px",
						maskImage:
							"linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 65%)",
						WebkitMaskImage:
							"linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 65%)",
					}}
				/>

				{/* Bottom accent */}
				<div
					className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
					style={{
						background:
							"linear-gradient(90deg, rgba(14,165,233,0.4), transparent 55%)",
					}}
				/>

				{/* Content */}
				<div className="relative px-6 pt-5 pb-5" style={{ zIndex: 1 }}>
					<div className="flex items-center gap-3 mb-3">
						{/* Icon — blue glow */}
						<div className="relative shrink-0">
							<div
								className="absolute inset-0 rounded-xl blur-sm pointer-events-none"
								style={{ background: "rgba(14,165,233,0.32)" }}
							/>
							<div
								className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
								style={{ background: "#0ea5e9" }}
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<rect x="2" y="7" width="20" height="14" rx="2" />
									<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
								</svg>
							</div>
						</div>

						<div>
							<h1
								className="text-base font-bold leading-tight"
								style={{ color: "var(--text-primary)" }}
							>
								{t("title")}
							</h1>
							<p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
								{EXPERIENCES.length} {t("companies")} · {totalRoles}{" "}
								{t("roles")} · 3+ {t("years")}
							</p>
						</div>
					</div>

					{/* Desc */}
					<p
						className="text-xs leading-relaxed"
						style={{ color: "var(--text-secondary)" }}
					>
						{t("headerDesc")}
					</p>
				</div>
			</div>

			{/* ── Timeline — scrollable ───────────────────────────── */}
			<div className="flex-1 overflow-auto px-6 py-5 space-y-8">
				{EXPERIENCES.map((exp, idx) => (
					<ExperienceCard
						key={exp.i18nKey}
						exp={exp}
						isLast={idx === EXPERIENCES.length - 1}
						t={translate}
						tExp={tExp}
					/>
				))}
			</div>
		</div>
	);
}
