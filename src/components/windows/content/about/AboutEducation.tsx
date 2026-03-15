"use client";

const EDUCATION = [
	{
		institution: "Institut Teknologi Sepuluh Nopember (ITS)",
		degree: "Bachelor's Degree, Computer Engineering",
		period: "Jul 2021 – Sep 2025",
		emoji: "🎓",
		color: "#0ea5e9",
		highlight: "GPA Honors",
	},
	{
		institution: "Apple Developer Academy | Indonesia",
		degree: "iOS Developer",
		period: "Feb 2025 – Dec 2025",
		emoji: "🍎",
		color: "#6366f1",
		highlight: "Swift & SwiftUI",
	},
];

interface AboutEducationProps {
	t: (key: string) => string;
}

export function AboutEducation({ t }: AboutEducationProps) {
	return (
		<div className="px-6 py-5 border-b border-(--border)">
			<h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
				{t("education")}
			</h2>

			<div className="space-y-3">
				{EDUCATION.map((edu, i) => (
					<div
						key={i}
						className="flex items-start gap-3 p-3 rounded-xl border"
						style={{
							background: `${edu.color}08`,
							borderColor: `${edu.color}20`,
						}}
					>
						<span className="text-2xl shrink-0">{edu.emoji}</span>
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2 flex-wrap">
								<p className="text-xs font-bold text-(--text-primary) leading-snug">
									{edu.institution}
								</p>
								<span
									className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
									style={{
										background: `${edu.color}18`,
										color: edu.color,
									}}
								>
									{edu.highlight}
								</span>
							</div>
							<p
								className="text-[11px] mt-0.5 font-medium"
								style={{ color: edu.color }}
							>
								{edu.degree}
							</p>
							<p className="text-[11px] mt-0.5 text-(--text-muted)">
								{edu.period}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
