"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { accentStyle } from "@/components/content/primitives";
import { formatYearMonth } from "@/lib/format";
import type { ExperienceEntry } from "./experience.data";

function CompanyLogo({ src, company }: { src?: string; company: string }) {
	const [failed, setFailed] = useState(false);

	if (!src || failed) {
		return (
			<span
				role="img"
				aria-label={company}
				className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0 shadow-md select-none bg-(--accent)"
			>
				{company.charAt(0).toUpperCase()}
			</span>
		);
	}

	return (
		<span className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-md border border-(--accent)/20">
			<Image
				src={src}
				alt={company}
				width={40}
				height={40}
				className="object-cover w-full h-full"
				onError={() => setFailed(true)}
			/>
		</span>
	);
}

interface ExperienceCardProps {
	exp: ExperienceEntry;
	isLast: boolean;
	/** h2 inside the Experience window, h3 under the About page's h2. */
	headingLevel?: 2 | 3;
}

function ExperienceCard({
	exp,
	isLast,
	headingLevel = 2,
}: ExperienceCardProps) {
	const t = useTranslations("ExperienceWindow");
	const tExp = useTranslations("Experience");
	const locale = useLocale();
	const Company = headingLevel === 2 ? "h2" : "h3";
	const Role = headingLevel === 2 ? "h3" : "h4";

	const company = tExp(`${exp.i18nKey}.company`);

	return (
		<article style={accentStyle(exp.color)} className="relative flex gap-4">
			{!isLast && (
				<span
					aria-hidden="true"
					className="absolute left-5 top-12 -bottom-6 w-px bg-linear-to-b from-(--accent)/40 to-transparent"
				/>
			)}

			<CompanyLogo src={exp.logo} company={company} />

			<div className="flex-1 min-w-0 pb-2">
				<header className="mb-3">
					<Company className="font-bold text-sm text-(--text-primary)">
						{company}
					</Company>
					<p className="text-xs text-(--text-muted)">
						{tExp(`${exp.i18nKey}.location`)}
					</p>
				</header>

				<div className="space-y-4">
					{exp.roles.map((role, index) => {
						const base = `${exp.i18nKey}.roles.${role.i18nKey}`;
						// `raw` returns the array itself — no more guessing at a fixed
						// number of `.0/.1/.2` keys inside a try/catch.
						const responsibilities = tExp.raw(`${base}.responsibilities`) as
							| string[]
							| undefined;
						const start = formatYearMonth(role.period.start, locale);
						const end = role.period.end
							? formatYearMonth(role.period.end, locale)
							: t("present");

						return (
							<section key={role.i18nKey} className="relative">
								{index < exp.roles.length - 1 && (
									<span
										aria-hidden="true"
										className="absolute left-0 top-full w-px h-4 mt-1 bg-(--accent)/20"
									/>
								)}

								<div className="flex flex-wrap items-start justify-between gap-1 mb-2 p-2.5 rounded-lg bg-(--accent)/5">
									<Role className="font-semibold text-sm text-(--text-primary)">
										{tExp(`${base}.title`)}
									</Role>
									<span className="text-[10px] px-2 py-0.5 rounded-full border shrink-0 font-medium text-(--accent) border-(--accent)/25 bg-(--accent)/6">
										<time dateTime={role.period.start}>{start}</time>
										{" – "}
										{role.period.end ? (
											<time dateTime={role.period.end}>{end}</time>
										) : (
											end
										)}
									</span>
								</div>

								{responsibilities && responsibilities.length > 0 && (
									<ul className="rounded-xl p-3 mb-2.5 border bg-(--surface-secondary) border-(--border) space-y-1.5">
										{responsibilities.map((item) => (
											<li
												key={item}
												className="flex gap-2 text-xs text-(--text-secondary)"
											>
												<span
													aria-hidden="true"
													className="mt-0.5 shrink-0 text-[10px] text-(--accent)"
												>
													▸
												</span>
												<span>{item}</span>
											</li>
										))}
									</ul>
								)}

								<ul
									className="flex flex-wrap gap-1.5"
									aria-label={t("techStack")}
								>
									{role.tech.map((tech) => (
										<li
											key={tech}
											className="text-[10px] px-2 py-0.5 rounded-full font-medium border bg-(--accent)/7 text-(--accent) border-(--accent)/15"
										>
											{tech}
										</li>
									))}
								</ul>
							</section>
						);
					})}
				</div>
			</div>
		</article>
	);
}

/** The full timeline — used by the Experience window and the /about page. */
export function ExperienceTimeline({
	entries,
	headingLevel,
}: {
	entries: ExperienceEntry[];
	headingLevel?: 2 | 3;
}) {
	return (
		<div className="space-y-8">
			{entries.map((exp, index) => (
				<ExperienceCard
					key={exp.i18nKey}
					exp={exp}
					isLast={index === entries.length - 1}
					headingLevel={headingLevel}
				/>
			))}
		</div>
	);
}
