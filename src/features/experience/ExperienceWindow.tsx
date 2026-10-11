"use client";

import { Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import { WindowHero } from "@/components/window/WindowHero";
import { ExperienceTimeline } from "./ExperienceCard";
import { EXPERIENCES } from "./experience.data";

const TOTAL_ROLES = EXPERIENCES.reduce((sum, e) => sum + e.roles.length, 0);

export default function ExperienceWindow() {
	const t = useTranslations("ExperienceWindow");

	return (
		<div className="h-full flex flex-col bg-(--window-bg) text-(--text-primary)">
			<WindowHero
				accent="#0ea5e9"
				accentTo="#10b98170"
				decoration="timeline"
				icon={<Briefcase size={15} className="text-white" />}
				title={t("title")}
				subtitle={`${EXPERIENCES.length} ${t("companies")} · ${TOTAL_ROLES} ${t("roles")} · 3+ ${t("years")}`}
				description={t("headerDesc")}
			/>

			<div className="flex-1 overflow-auto px-6 py-5">
				<ExperienceTimeline entries={EXPERIENCES} />
			</div>
		</div>
	);
}
