"use client";

const CURRENT_ITEMS = [
	{
		emoji: "🤖",
		text: "Robotics Engineer @ PT. Ezra Robotics Teknologi",
		sub: "Quadruped inspection robots for industrial clients",
		color: "#e95420",
	},
	{
		emoji: "🍎",
		text: "iOS Developer @ Apple Developer Academy Indonesia",
		sub: "Building native Swift applications",
		color: "#0ea5e9",
	},
	{
		emoji: "🎓",
		text: "Research Mentor @ ASEEC Education",
		sub: "Guiding students in national innovation competitions",
		color: "#10b981",
	},
];

interface AboutCurrentlyProps {
	t: (key: string) => string;
}

export function AboutCurrently({ t }: AboutCurrentlyProps) {
	return (
		<div className="px-6 py-5 border-b border-(--border)">
			<h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
				{t("currentlyDoing")}
			</h2>

			<div className="space-y-3">
				{CURRENT_ITEMS.map((item, i) => (
					<div
						key={i}
						className="flex items-start gap-3 p-3 rounded-xl border bg-(--surface-secondary) border-(--border)"
					>
						<span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
						<div className="min-w-0">
							<p className="text-xs font-semibold text-(--text-primary) leading-snug">
								{item.text}
							</p>
							<p className="text-[11px] mt-0.5 text-(--text-muted)">
								{item.sub}
							</p>
						</div>
						<div
							className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 animate-pulse"
							style={{ background: item.color }}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
