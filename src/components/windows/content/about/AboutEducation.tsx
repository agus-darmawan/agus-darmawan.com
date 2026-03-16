"use client";

import { Award, GraduationCap } from "lucide-react";

const EDUCATION = [
	{
		institutionKey: "educationIts",
		degreeKey: "educationItsDegree",
		period: "Jul 2021 – Sep 2025",
		color: "#0ea5e9",
		highlightKey: "educationItsHighlight",
		achievements: [
			"educationItsAchievement1",
			"educationItsAchievement2",
			"educationItsAchievement3",
		],
	},
	{
		institutionKey: "educationApple",
		degreeKey: "educationAppleDegree",
		period: "Feb 2025 – Dec 2025",
		color: "#6366f1",
		highlightKey: "educationAppleHighlight",
		achievements: ["educationAppleAchievement1", "educationAppleAchievement2"],
	},
];

interface AboutEducationProps {
	t: (key: string) => string;
}

export function AboutEducation({ t }: AboutEducationProps) {
	return (
		<div
			className="px-6 py-5 border-b"
			style={{ borderColor: "var(--border)" }}
		>
			<h2
				className="text-xs font-semibold uppercase tracking-wider mb-4"
				style={{ color: "var(--text-muted)" }}
			>
				{t("education")}
			</h2>

			<div className="space-y-3">
				{EDUCATION.map((edu, i) => (
					<div
						key={i}
						className="p-3 rounded-xl border"
						style={{
							background: `${edu.color}08`,
							borderColor: `${edu.color}20`,
						}}
					>
						<div className="flex items-start gap-3">
							{/* School icon */}
							<div
								className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
								style={{
									background: `${edu.color}18`,
									border: `1px solid ${edu.color}28`,
								}}
							>
								<GraduationCap size={16} style={{ color: edu.color }} />
							</div>

							<div className="flex-1 min-w-0">
								{/* Header */}
								<div className="flex items-start justify-between gap-2 flex-wrap">
									<p
										className="text-xs font-bold leading-snug"
										style={{ color: "var(--text-primary)" }}
									>
										{t(edu.institutionKey)}
									</p>
									<span
										className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
										style={{
											background: `${edu.color}18`,
											color: edu.color,
										}}
									>
										{t(edu.highlightKey)}
									</span>
								</div>

								{/* Degree + period */}
								<p
									className="text-[11px] mt-0.5 font-medium"
									style={{ color: edu.color }}
								>
									{t(edu.degreeKey)}
								</p>
								<p
									className="text-[10px] mt-0.5 tabular-nums"
									style={{ color: "var(--text-muted)" }}
								>
									{edu.period}
								</p>

								{/* Achievements */}
								<ul className="mt-2 space-y-1">
									{edu.achievements.map((key) => (
										<li
											key={key}
											className="flex items-start gap-1.5 text-[11px]"
											style={{ color: "var(--text-secondary)" }}
										>
											<Award
												size={10}
												className="shrink-0 mt-0.5"
												style={{ color: edu.color }}
											/>
											<span>{t(key)}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
