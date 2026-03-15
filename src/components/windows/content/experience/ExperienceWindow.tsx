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
			className="h-full overflow-auto"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			<div
				className="px-6 pt-6 pb-4 border-b sticky top-0 z-10"
				style={{
					borderColor: "var(--border)",
					background: "var(--window-bg)",
					backdropFilter: "blur(8px)",
				}}
			>
				<h1
					className="text-lg font-bold"
					style={{ color: "var(--text-primary)" }}
				>
					{t("title")}
				</h1>
				<p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
					{EXPERIENCES.length} {t("companies")} · {totalRoles} {t("roles")} · 3+{" "}
					{t("years")}
				</p>
			</div>

			<div className="px-6 py-5 space-y-8">
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
