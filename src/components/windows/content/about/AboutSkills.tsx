"use client";

const SKILL_GROUPS = [
	{
		label: "Frontend",
		color: "#e95420",
		skills: ["Swift", "React", "Next.js", "TypeScript", "Tailwind CSS"],
	},
	{
		label: "Backend",
		color: "#3b82f6",
		skills: ["Node.js", "Express", "PostgreSQL", "Prisma"],
	},
	{
		label: "Robotics",
		color: "#10b981",
		skills: ["ROS", "Gazebo", "OpenCV", "Python", "C++", "ESP-IDF"],
	},
] as const;

interface AboutSkillsProps {
	t: (key: string) => string;
}

export function AboutSkills({ t }: AboutSkillsProps) {
	return (
		<div className="px-6 py-5 border-b border-(--border)">
			<h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
				{t("skills")}
			</h2>

			<div className="space-y-3">
				{SKILL_GROUPS.map((group) => (
					<div
						key={group.label}
						style={{ "--skill": group.color } as React.CSSProperties}
					>
						<p className="text-xs font-medium mb-1.5 text-(--skill)">
							{group.label}
						</p>

						<div className="flex flex-wrap gap-1.5">
							{group.skills.map((skill) => (
								<span
									key={skill}
									className="text-xs px-2 py-0.5 rounded-full font-medium border
                  text-(--skill)
                  bg-[color-mix(in_srgb,var(--skill)_10%,transparent)]
                  border-[color-mix(in_srgb,var(--skill)_20%,transparent)]"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
