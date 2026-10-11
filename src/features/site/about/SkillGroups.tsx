import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { SKILL_GROUPS } from "@/features/about/about.data";

/** Skills in three columns, one per discipline. */
export function SkillGroups() {
	const t = useTranslations("AboutWindow");

	return (
		<div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
			{SKILL_GROUPS.map((group) => (
				<div key={group.labelKey} style={accentStyle(group.color)}>
					<h3 className="flex items-center gap-2.5 font-medium text-(--site-ink)">
						<span
							aria-hidden="true"
							className="size-2.5 rounded-sm bg-(--accent)"
						/>
						{t(group.labelKey)}
					</h3>
					<ul className="mt-3 space-y-1.5 border-l border-(--site-line) pl-4">
						{group.skills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
