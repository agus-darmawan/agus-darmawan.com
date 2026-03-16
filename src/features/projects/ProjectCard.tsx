"use client";

import {
	ArrowUpRight,
	ExternalLink,
	GitFork,
	Github,
	Star,
} from "lucide-react";
import type { ProjectMeta } from "./projects.data";

interface ProjectCardProps {
	project: ProjectMeta;
	name: string;
	desc: string;
	onClick: (project: ProjectMeta) => void;
}

export function ProjectCard({
	project,
	name,
	desc,
	onClick,
}: ProjectCardProps) {
	return (
		<div
			onClick={() => onClick(project)}
			className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-200 relative cursor-pointer"
			style={{
				background: "var(--surface-secondary)",
				border: "1px solid var(--border)",
			}}
			onMouseEnter={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = `${project.color}60`;
				el.style.transform = "translateY(-2px)";
				el.style.boxShadow = `0 8px 32px ${project.color}20`;
			}}
			onMouseLeave={(e) => {
				const el = e.currentTarget as HTMLElement;
				el.style.borderColor = "var(--border)";
				el.style.transform = "none";
				el.style.boxShadow = "none";
			}}
		>
			{/* Top accent bar */}
			<div
				className="h-0.5 w-full"
				style={{
					background: project.featured
						? `linear-gradient(90deg, ${project.color}, ${project.color}40)`
						: `${project.color}40`,
				}}
			/>

			{/* Hover glow */}
			<div
				className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
				style={{
					background: `radial-gradient(ellipse at top left, ${project.color}08 0%, transparent 60%)`,
				}}
			/>

			<div className="relative p-4">
				{/* Top row: icon + title + arrow */}
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-start gap-3">
						<div
							className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
							style={{
								background: `${project.color}18`,
								border: `1px solid ${project.color}28`,
							}}
						>
							{project.emoji}
						</div>

						<div className="min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h2
									className="font-semibold text-sm leading-tight"
									style={{ color: "var(--text-primary)" }}
								>
									{name}
								</h2>
								{project.featured && (
									<span
										className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide"
										style={{
											background: `${project.color}18`,
											color: project.color,
											border: `1px solid ${project.color}30`,
										}}
									>
										Featured
									</span>
								)}
							</div>
							<span
								className="text-[10px] mt-0.5 inline-block capitalize"
								style={{ color: "var(--text-muted)" }}
							>
								{project.category}
							</span>
						</div>
					</div>

					{/* Arrow — appears on hover, no text */}
					<div
						className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						style={{ background: `${project.color}18`, color: project.color }}
					>
						<ArrowUpRight size={14} />
					</div>
				</div>

				{/* Description */}
				<p
					className="text-xs leading-relaxed mb-3 line-clamp-2 text-left"
					style={{ color: "var(--text-secondary)" }}
				>
					{desc}
				</p>

				{/* Tech tags */}
				<div className="flex flex-wrap gap-1.5 mb-3">
					{project.tech.slice(0, 4).map((tech) => (
						<span
							key={tech}
							className="text-[10px] px-2 py-0.5 rounded-md font-medium"
							style={{
								background: "var(--window-bg)",
								color: "var(--text-muted)",
								border: "1px solid var(--border)",
							}}
						>
							{tech}
						</span>
					))}
					{project.tech.length > 4 && (
						<span
							className="text-[10px] px-2 py-0.5 rounded-md"
							style={{ color: "var(--text-muted)" }}
						>
							+{project.tech.length - 4} more
						</span>
					)}
				</div>

				{/* Footer: stats + GitHub/Demo links */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span
							className="flex items-center gap-1 text-[11px]"
							style={{ color: "var(--text-muted)" }}
						>
							<Star size={11} />
							{project.stars}
						</span>
						<span
							className="flex items-center gap-1 text-[11px]"
							style={{ color: "var(--text-muted)" }}
						>
							<GitFork size={11} />
							{Math.floor(project.stars * 0.4)}
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<a
							href={project.github}
							target="_blank"
							rel="noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border font-medium transition-colors"
							style={{
								color: "var(--text-muted)",
								borderColor: "var(--border)",
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
									"var(--text-muted)";
							}}
						>
							<Github size={10} />
							Code
						</a>

						{project.demo && (
							<a
								href={project.demo}
								target="_blank"
								rel="noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium text-white transition-opacity hover:opacity-80"
								style={{ background: project.color }}
							>
								<ExternalLink size={10} />
								Demo
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
