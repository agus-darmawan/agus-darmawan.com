"use client";

import { useTranslations } from "next-intl";

export default function ExperienceWindow() {
	const t = useTranslations("ExperienceWindow");

	return (
		<div
			className="h-full flex items-center justify-center p-8"
			style={{ color: "var(--text-primary)" }}
		>
			<div className="text-center space-y-3 max-w-sm">
				<div
					className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-lg"
					style={{ background: "var(--surface-secondary)" }}
				>
					💼
				</div>
				<h2 className="text-xl font-semibold">{t("title")}</h2>
				<p className="text-sm" style={{ color: "var(--text-muted)" }}>
					Coming soon
				</p>
			</div>
		</div>
	);
}
