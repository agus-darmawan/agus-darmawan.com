"use client";

import type { ExperienceEntry } from "./experienceData";

interface ExperienceCardProps {
	exp: ExperienceEntry;
	isLast: boolean;
	t: (key: string) => string;
}

export function ExperienceCard({ exp, isLast, t }: ExperienceCardProps) {
	const hasPromotion = exp.roles.length > 1;

	return (
		<div className="relative flex gap-4">
			{/* Vertical connector line */}
			{!isLast && (
				<div
					className="absolute left-5 top-12 w-px"
					style={{
						bottom: "-1.5rem",
						background: `linear-gradient(to bottom, ${exp.color}60, transparent)`,
					}}
				/>
			)}

			{/* Company logo */}
			<div
				className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md"
				style={{ background: exp.color }}
			>
				{exp.logo}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0 pb-2">
				{/* Company header */}
				<div className="mb-3">
					<div className="flex items-center gap-2 flex-wrap">
						<h2
							className="font-bold text-sm"
							style={{ color: "var(--text-primary)" }}
						>
							{exp.company}
						</h2>
						{hasPromotion && (
							<span
								className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
								style={{
									background: `${exp.color}18`,
									color: exp.color,
									border: `1px solid ${exp.color}30`,
								}}
							>
								↑ {t("promoted")}
							</span>
						)}
					</div>
					<p className="text-xs" style={{ color: "var(--text-muted)" }}>
						{exp.location}
					</p>
				</div>

				{/* Roles */}
				<div className="space-y-4">
					{exp.roles.map((role, roleIdx) => (
						<div key={`${role.title}-${roleIdx}`} className="relative">
							{/* Role connector for multi-role companies */}
							{hasPromotion && roleIdx < exp.roles.length - 1 && (
								<div
									className="absolute left-0 top-full w-px h-4 mt-1"
									style={{ background: `${exp.color}30` }}
								/>
							)}

							{/* Role header */}
							<div
								className="flex flex-wrap items-start justify-between gap-1 mb-2 p-2.5 rounded-lg"
								style={{ background: `${exp.color}0c` }}
							>
								<div>
									<h3
										className="font-semibold text-sm"
										style={{ color: "var(--text-primary)" }}
									>
										{role.title}
									</h3>
								</div>
								<span
									className="text-[10px] px-2 py-0.5 rounded-full border shrink-0 font-medium"
									style={{
										color: exp.color,
										borderColor: `${exp.color}40`,
										background: `${exp.color}10`,
									}}
								>
									{role.period.start} – {role.period.end ?? t("present")}
								</span>
							</div>

							{/* Responsibilities */}
							<div
								className="rounded-xl p-3 mb-2.5 border"
								style={{
									background: "var(--surface-secondary)",
									borderColor: "var(--border)",
								}}
							>
								<ul className="space-y-1.5">
									{role.responsibilities.map((r, i) => (
										<li
											key={i}
											className="flex gap-2 text-xs"
											style={{ color: "var(--text-secondary)" }}
										>
											<span
												className="mt-0.5 shrink-0 text-[10px]"
												style={{ color: exp.color }}
											>
												▸
											</span>
											<span>{r}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Tech stack */}
							<div className="flex flex-wrap gap-1.5">
								{role.tech.map((tech) => (
									<span
										key={tech}
										className="text-[10px] px-2 py-0.5 rounded-full font-medium"
										style={{
											background: `${exp.color}12`,
											color: exp.color,
											border: `1px solid ${exp.color}28`,
										}}
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
