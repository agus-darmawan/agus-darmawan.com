"use client";

const SKILL_GROUPS = [
	{
		label: "Frontend",
		color: "#e95420",
		skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue 3"],
	},
	{
		label: "Backend",
		color: "#3b82f6",
		skills: ["Node.js", "Go", "Express", "Fastify", "REST API"],
	},
	{
		label: "Database",
		color: "#10b981",
		skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma"],
	},
	{
		label: "DevOps",
		color: "#8b5cf6",
		skills: ["Docker", "GitHub Actions", "Vercel", "AWS"],
	},
] as const;

interface AboutSkillsProps {
	t: (key: string) => string;
}

export function AboutSkills({ t }: AboutSkillsProps) {
	return (
		<div
			className="px-6 py-5 border-b"
			style={{ borderColor: "var(--border)" }}
		>
			<h2
				className="text-xs font-semibold uppercase tracking-wider mb-4"
				style={{ color: "var(--text-muted)" }}
			>
				{t("skills")}
			</h2>

			<div className="space-y-3">
				{SKILL_GROUPS.map((group) => (
					<div key={group.label}>
						<p
							className="text-xs font-medium mb-1.5"
							style={{ color: group.color }}
						>
							{group.label}
						</p>
						<div className="flex flex-wrap gap-1.5">
							{group.skills.map((skill) => (
								<span
									key={skill}
									className="text-xs px-2 py-0.5 rounded-full font-medium"
									style={{
										background: `${group.color}14`,
										color: group.color,
										border: `1px solid ${group.color}28`,
									}}
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
