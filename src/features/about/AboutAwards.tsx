"use client";

const AWARDS = [
	{
		title: "Grand Champion",
		event: "International Roboboat Competition (IRC) 2023",
		level: "International",
		year: "2023",
		emoji: "🏆",
		color: "#f59e0b",
	},
	{
		title: "1st Place — Paper Competition & Favorite Paper",
		event: "ICAVETS 2022",
		level: "International",
		year: "2022",
		emoji: "🥇",
		color: "#e95420",
	},
	{
		title: "2nd Place — Design Documentation",
		event: "International Roboboat Competition (IRC) 2023",
		level: "International",
		year: "2023",
		emoji: "🥈",
		color: "#6366f1",
	},
	{
		title: "1st Place — Unmanned Water Vessel",
		event: "KKI (Kontes Kapal Indonesia) 2022",
		level: "National",
		year: "2022",
		emoji: "🥇",
		color: "#10b981",
	},
	{
		title: "1st Place — Unmanned Water Vessel",
		event: "KKI (Kontes Kapal Indonesia) 2023",
		level: "National",
		year: "2023",
		emoji: "🥇",
		color: "#10b981",
	},
];

const LEVEL_COLORS: Record<string, string> = {
	International: "#e95420",
	National: "#0ea5e9",
};

interface AboutAwardsProps {
	t: (key: string) => string;
}

export function AboutAwards({ t }: AboutAwardsProps) {
	return (
		<div className="px-6 py-5 border-b border-(--border)">
			<h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
				{t("awards")}
			</h2>

			<div className="space-y-2.5">
				{AWARDS.map((award, i) => (
					<div
						key={i}
						className="flex items-start gap-3 p-3 rounded-xl border bg-(--surface-secondary) border-(--border) group"
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								`${award.color}40`;
							(e.currentTarget as HTMLElement).style.background =
								`${award.color}08`;
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								"var(--border)";
							(e.currentTarget as HTMLElement).style.background =
								"var(--surface-secondary)";
						}}
					>
						<span className="text-xl shrink-0">{award.emoji}</span>
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2 flex-wrap">
								<p className="text-xs font-bold text-(--text-primary) leading-snug">
									{award.title}
								</p>
								<div className="flex items-center gap-1.5 shrink-0">
									<span
										className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
										style={{
											background: `${LEVEL_COLORS[award.level]}18`,
											color: LEVEL_COLORS[award.level],
										}}
									>
										{award.level}
									</span>
									<span className="text-[10px] text-(--text-muted)">
										{award.year}
									</span>
								</div>
							</div>
							<p className="text-[11px] mt-0.5 text-(--text-muted)">
								{award.event}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
