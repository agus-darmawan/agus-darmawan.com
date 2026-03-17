// src/features/about/AboutPublications.tsx
// Fix #7 — hapus DOI link palsu, ganti dengan tombol yang hidden sampai DOI asli tersedia

"use client";

import { BookOpen } from "lucide-react";

const PUBLICATIONS = [
	{
		titleKey: "publicationQuadruped",
		authorsKey: "publicationQuadrupedAuthors",
		venueKey: "publicationQuadrupedVenue",
		year: "2025",
		color: "#10b981",
		link: "https://ieeexplore.ieee.org/document/11137561/",
	},
	{
		titleKey: "publicationGesture",
		authorsKey: "publicationGestureAuthors",
		venueKey: "publicationGestureVenue",
		year: "2024",
		color: "#8b5cf6",
		link: "https://repository.its.ac.id/123032/",
	},
];

interface AboutPublicationsProps {
	t: (key: string) => string;
}

export function AboutPublications({ t }: AboutPublicationsProps) {
	return (
		<div
			className="px-6 py-5 border-b"
			style={{ borderColor: "var(--border)" }}
		>
			<h2
				className="text-xs font-semibold uppercase tracking-wider mb-4"
				style={{ color: "var(--text-muted)" }}
			>
				{t("publications")}
			</h2>

			<div className="space-y-3">
				{PUBLICATIONS.map((pub, i) => (
					<div
						key={i}
						className="p-3.5 rounded-xl border transition-all duration-200"
						style={{
							background: `${pub.color}06`,
							borderColor: `${pub.color}20`,
						}}
						onMouseEnter={(e) => {
							const el = e.currentTarget as HTMLElement;
							el.style.borderColor = `${pub.color}40`;
							el.style.background = `${pub.color}0d`;
						}}
						onMouseLeave={(e) => {
							const el = e.currentTarget as HTMLElement;
							el.style.borderColor = `${pub.color}20`;
							el.style.background = `${pub.color}06`;
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
								<p
									className="text-xs font-semibold leading-snug mb-1"
									style={{ color: "var(--text-primary)" }}
								>
									{t(pub.titleKey)}
								</p>
								<p
									className="text-[11px] mb-1.5"
									style={{ color: "var(--text-muted)" }}
								>
									{t(pub.authorsKey)}
								</p>

								<div className="flex items-center justify-between flex-wrap gap-2">
									<span
										className="text-[10px] font-medium"
										style={{ color: pub.color }}
									>
										{t(pub.venueKey)}
									</span>

									<div className="flex items-center gap-2 shrink-0">
										<span
											className="text-[10px] tabular-nums"
											style={{ color: "var(--text-muted)" }}
										>
											{pub.year}
										</span>

										{/* Hanya tampil kalau DOI asli sudah diisi */}
										{pub.link && (
											<a
												href={pub.link}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium transition-opacity hover:opacity-80"
												style={{
													background: `${pub.color}18`,
													color: pub.color,
													border: `1px solid ${pub.color}30`,
												}}
											>
												{t("readPublication")}
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
