import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { AboutSection } from "./AboutSection";
import { SKILL_GROUPS } from "./about.data";

export function AboutSkills() {
	const t = useTranslations("AboutWindow");

	return (
		<AboutSection title={t("skills")}>
			<div className="space-y-3">
				{SKILL_GROUPS.map((group) => (
					<div key={group.labelKey} style={accentStyle(group.color)}>
						<h3 className="text-xs font-medium mb-1.5 text-(--accent)">
							{t(group.labelKey)}
						</h3>
						<ul className="flex flex-wrap gap-1.5">
							{group.skills.map((skill) => (
								<li
									key={skill}
									className="text-xs px-2 py-0.5 rounded-full font-medium border text-(--accent) bg-(--accent)/10 border-(--accent)/20"
								>
									{skill}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</AboutSection>
	);
}
