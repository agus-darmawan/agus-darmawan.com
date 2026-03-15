"use client";

import Image from "next/image";
import { useState } from "react";
import type { ExperienceEntry } from "./experienceData";

interface ExperienceCardProps {
	exp: ExperienceEntry;
	isLast: boolean;
	t: (key: string, values?: Record<string, string>) => string;
	tExp: (key: string) => string;
}

function CompanyLogo({
	src,
	company,
	color,
	alt,
}: {
	src: string;
	company: string;
	color: string;
	alt: string;
}) {
	const [errored, setErrored] = useState(false);
	const initial = company.charAt(0).toUpperCase();

	if (errored) {
		return (
			<div
				className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0 shadow-md select-none"
				style={{ background: color }}
				role="img"
				aria-label={alt}
			>
				{initial}
			</div>
		);
	}

	return (
		<div
			className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-md border"
			style={{ borderColor: `${color}30` }}
		>
			<Image
				src={src}
				alt={alt}
				width={40}
				height={40}
				className="object-cover w-full h-full"
				onError={() => setErrored(true)}
				unoptimized
			/>
		</div>
	);
}

export function ExperienceCard({ exp, isLast, t, tExp }: ExperienceCardProps) {
	const hasPromotion = exp.roles.length > 1;
	const companyName = tExp(`${exp.i18nKey}.company`);
	const location = tExp(`${exp.i18nKey}.location`);

	return (
		<div className="relative flex gap-4">
			{!isLast && (
				<div
					className="absolute left-5 top-12 w-px"
					style={{
						bottom: "-1.5rem",
						background: `linear-gradient(to bottom, ${exp.color}60, transparent)`,
					}}
				/>
			)}

			<CompanyLogo
				src={exp.logo}
				company={companyName}
				color={exp.color}
				alt={companyName}
			/>

			<div className="flex-1 min-w-0 pb-2">
				<div className="mb-3">
					<div className="flex items-center gap-2 flex-wrap">
						<h2 className="font-bold text-sm text-(--text-primary)">
							{companyName}
						</h2>

						{hasPromotion && (
							<span
								className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold border"
								style={{
									background: `${exp.color}18`,
									color: exp.color,
									borderColor: `${exp.color}30`,
								}}
							>
								↑ {t("promoted")}
							</span>
						)}
					</div>

					<p className="text-xs text-(--text-muted)">{location}</p>
				</div>

				<div className="space-y-4">
					{exp.roles.map((role, roleIdx) => {
						const roleTitle = tExp(`${exp.i18nKey}.roles.${role.i18nKey}.title`);
						const responsibilities = Array.from({ length: 3 }, (_, i) => {
							try {
								return tExp(`${exp.i18nKey}.roles.${role.i18nKey}.responsibilities.${i}`);
							} catch {
								return null;
							}
						}).filter(Boolean) as string[];

						return (
							<div key={`${role.i18nKey}-${roleIdx}`} className="relative">
								{hasPromotion && roleIdx < exp.roles.length - 1 && (
									<div
										className="absolute left-0 top-full w-px h-4 mt-1"
										style={{ background: `${exp.color}30` }}
									/>
								)}

								<div
									className="flex flex-wrap items-start justify-between gap-1 mb-2 p-2.5 rounded-lg"
									style={{ background: `${exp.color}0c` }}
								>
									<h3 className="font-semibold text-sm text-(--text-primary)">
										{roleTitle}
									</h3>

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

								<div className="rounded-xl p-3 mb-2.5 border bg-(--surface-secondary) border-(--border)">
									<ul className="space-y-1.5">
										{responsibilities.map((r, i) => (
											<li
												key={i}
												className="flex gap-2 text-xs text-(--text-secondary)"
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

								<div className="flex flex-wrap gap-1.5">
									{role.tech.map((tech) => (
										<span
											key={tech}
											className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
											style={{
												background: `${exp.color}12`,
												color: exp.color,
												borderColor: `${exp.color}28`,
											}}
										>
											{tech}
										</span>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
