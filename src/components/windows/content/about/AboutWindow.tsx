"use client";

import { useTranslations } from "next-intl";
import { AboutAwards } from "./AboutAwards";
import { AboutEducation } from "./AboutEducation";
import { AboutHeader } from "./AboutHeader";
import { AboutPublications } from "./AboutPublications";
import { AboutSkills } from "./AboutSkills";

export default function AboutWindow() {
	const t = useTranslations("AboutWindow");

	return (
		<div
			className="h-full overflow-auto"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			<AboutHeader t={t} />
			<AboutSkills t={t} />
			<AboutEducation t={t} />
			<AboutAwards t={t} />
			<AboutPublications t={t} />
		</div>
	);
}
