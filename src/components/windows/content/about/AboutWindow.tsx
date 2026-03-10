"use client";

import { useTranslations } from "next-intl";
import { AboutContact } from "./AboutContact";
import { AboutHeader } from "./AboutHeader";
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
			<AboutContact t={t} />
		</div>
	);
}
