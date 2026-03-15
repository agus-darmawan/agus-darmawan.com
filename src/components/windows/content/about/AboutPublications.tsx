"use client";

import { BookOpen, ExternalLink } from "lucide-react";

const PUBLICATIONS = [
	{
		title:
			"Development of a Quadruped-Legged Robot for Position Estimation of Overheat Components in Electrical Substations Using a Thermal Camera",
		authors: "Agus Darmawan et al.",
		venue: "PT. Ezra Robotics Teknologi / Research Journal",
		year: "2025",
		color: "#10b981",
		link: null,
	},
	{
		title:
			"Hand Gesture Recognition for Collaborative Robots Using Lightweight Deep Learning in Real-Time Robotic Systems",
		authors: "Agus Darmawan et al.",
		venue: "Institut Teknologi Sepuluh Nopember (ITS)",
		year: "2024",
		color: "#8b5cf6",
		link: null,
	},
];

interface AboutPublicationsProps {
	t: (key: string) => string;
}

export function AboutPublications({ t }: AboutPublicationsProps) {
	return (
		<div className="px-6 py-5 border-b border-(--border)">
			<h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
				{t("publications")}
			</h2>

			<div className="space-y-3">
				{PUBLICATIONS.map((pub, i) => (
					<div
						key={i}
						className="p-3.5 rounded-xl border"
						style={{
							background: `${pub.color}06`,
							borderColor: `${pub.color}20`,
						}}
					>
						<div className="flex items-start gap-2.5">
							<div
								className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
								style={{ background: `${pub.color}18` }}
							>
								<BookOpen size={13} style={{ color: pub.color }} />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-xs font-semibold text-(--text-primary) leading-snug mb-1">
									{pub.title}
								</p>
								<p className="text-[11px] text-(--text-muted) mb-1">
									{pub.authors}
								</p>
								<div className="flex items-center justify-between flex-wrap gap-1">
									<span
										className="text-[10px] font-medium"
										style={{ color: pub.color }}
									>
										{pub.venue}
									</span>
									<div className="flex items-center gap-2">
										<span className="text-[10px] text-(--text-muted)">
											{pub.year}
										</span>
										{pub.link && (
											<a
												href={pub.link}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-0.5 text-[10px] transition-opacity hover:opacity-70"
												style={{ color: pub.color }}
											>
												<ExternalLink size={10} />
												Read
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
