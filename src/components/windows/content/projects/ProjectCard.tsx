"use client";

import { ExternalLink, Github, Star } from "lucide-react";
import type { Project } from "./projectsData";

interface ProjectCardProps {
	project: Project;
	onClick: (project: Project) => void;
	t: (key: string) => string;
}

export function ProjectCard({ project, onClick, t }: ProjectCardProps) {
	return (
		<button
			type="button"
			onClick={() => onClick(project)}
			className="w-full text-left rounded-xl border overflow-hidden transition-all group"
			style={{
				background: "var(--surface-secondary)",
				borderColor: "var(--border)",
			}}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.borderColor = project.color;
				(e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
				(e.currentTarget as HTMLElement).style.boxShadow =
					`0 4px 20px ${project.color}20`;
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
				(e.currentTarget as HTMLElement).style.transform = "none";
				(e.currentTarget as HTMLElement).style.boxShadow = "none";
			}}
		>
			{/* Top accent */}
			<div
				className="h-0.5"
				style={{
					background: project.featured ? project.color : "transparent",
				}}
			/>

			<div className="p-4">
				<div className="flex items-start gap-3">
					<div
						className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
						style={{ background: `${project.color}18` }}
					>
						{project.emoji}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-0.5">
							<h2
								className="font-semibold text-sm"
								style={{ color: "var(--text-primary)" }}
							>
								{project.name}
							</h2>
							{project.featured && (
								<span
									className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
									style={{
										background: `${project.color}18`,
										color: project.color,
									}}
								>
									⭐ {t("featured")}
								</span>
							)}
						</div>
						<p
							className="text-xs leading-relaxed"
							style={{ color: "var(--text-secondary)" }}
						>
							{project.desc}
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between mt-3 flex-wrap gap-2">
					<div className="flex flex-wrap gap-1">
						{project.tech.slice(0, 3).map((tech) => (
							<span
								key={tech}
								className="text-[10px] px-1.5 py-0.5 rounded"
								style={{
									background: "var(--border)",
									color: "var(--text-muted)",
								}}
							>
								{tech}
							</span>
						))}
						{project.tech.length > 3 && (
							<span
								className="text-[10px] px-1.5 py-0.5 rounded"
								style={{ color: "var(--text-muted)" }}
							>
								+{project.tech.length - 3}
							</span>
						)}
					</div>

					<div className="flex items-center gap-2">
						<span
							className="flex items-center gap-1 text-xs"
							style={{ color: "var(--text-muted)" }}
						>
							<Star size={11} />
							{project.stars}
						</span>

						{/* Prevent card click when clicking links */}
						<a
							href={project.github}
							target="_blank"
							rel="noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors"
							style={{
								color: "var(--text-secondary)",
								borderColor: "var(--border)",
								background: "var(--window-bg)",
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor =
									project.color;
								(e.currentTarget as HTMLElement).style.color = project.color;
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor =
									"var(--border)";
								(e.currentTarget as HTMLElement).style.color =
									"var(--text-secondary)";
							}}
						>
							<Github size={11} />
							{t("viewCode")}
						</a>

						{project.demo && (
							<a
								href={project.demo}
								target="_blank"
								rel="noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-white"
								style={{ background: project.color }}
							>
								<ExternalLink size={11} />
								{t("viewDemo")}
							</a>
						)}
					</div>
				</div>
			</div>
		</button>
	);
}
