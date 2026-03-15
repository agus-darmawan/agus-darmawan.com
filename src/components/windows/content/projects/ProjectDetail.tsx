"use client";

import { ExternalLink, Github, Star, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Project } from "./projectsData";
import { ReadmeRenderer } from "./readme/ReadmeRenderer";

interface ProjectDetailProps {
	project: Project;
	onClose: () => void;
	t: (key: string) => string;
}

export function ProjectDetail({ project, onClose, t }: ProjectDetailProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	return (
		<div
			ref={overlayRef}
			className="absolute inset-0 z-50 flex animate-fade-in"
			style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
			onClick={(e) => {
				if (e.target === overlayRef.current) onClose();
			}}
		>
			<div
				className="m-auto w-full max-w-2xl max-h-[90%] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
				style={{
					background: "var(--window-bg)",
					border: `1px solid ${project.color}40`,
				}}
			>
				{/* Header */}
				<div
					className="flex items-start gap-4 px-5 py-4 border-b shrink-0"
					style={{
						borderColor: "var(--border)",
						background: `linear-gradient(135deg, ${project.color}12 0%, transparent 60%)`,
					}}
				>
					<div
						className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
						style={{ background: `${project.color}20` }}
					>
						{project.emoji}
					</div>

					<div className="flex-1 min-w-0">
						<h2
							className="font-bold text-base"
							style={{ color: "var(--text-primary)" }}
						>
							{project.name}
						</h2>
						<p
							className="text-xs mt-0.5"
							style={{ color: "var(--text-muted)" }}
						>
							{project.desc}
						</p>
						<div className="flex items-center gap-3 mt-2 flex-wrap">
							<span
								className="flex items-center gap-1 text-xs"
								style={{ color: "var(--text-muted)" }}
							>
								<Star size={11} />
								{project.stars} stars
							</span>
							<span
								className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
								style={{
									background: `${project.color}18`,
									color: project.color,
									border: `1px solid ${project.color}30`,
								}}
							>
								{project.category}
							</span>
						</div>
					</div>

					<button
						title="Close"
						type="button"
						onClick={onClose}
						className="p-1.5 rounded-lg transition-colors shrink-0"
						style={{ color: "var(--text-muted)" }}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.background =
								"var(--surface-secondary)";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.background = "transparent";
						}}
					>
						<X size={16} />
					</button>
				</div>

				{/* Tech badges */}
				<div
					className="px-5 py-3 flex flex-wrap gap-1.5 border-b shrink-0"
					style={{ borderColor: "var(--border)" }}
				>
					{project.tech.map((tech) => (
						<span
							key={tech}
							className="text-xs px-2 py-0.5 rounded-full font-medium"
							style={{
								background: `${project.color}12`,
								color: project.color,
								border: `1px solid ${project.color}28`,
							}}
						>
							{tech}
						</span>
					))}
				</div>

				{/* README — scrollable container, ref passed to renderer for TOC tracking */}
				<div ref={scrollRef} className="flex-1 overflow-auto min-h-0 px-5 py-4">
					<ReadmeRenderer
						content={project.readme}
						accentColor={project.color}
						scrollRef={scrollRef}
					/>
				</div>

				{/* Footer */}
				<div
					className="px-5 py-3 border-t flex gap-2 shrink-0"
					style={{ borderColor: "var(--border)" }}
				>
					<a
						href={project.github}
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium transition-colors"
						style={{
							color: "var(--text-secondary)",
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
								"var(--text-secondary)";
						}}
					>
						<Github size={13} />
						{t("viewCode")}
					</a>

					{project.demo && (
						<a
							href={project.demo}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium text-white"
							style={{ background: project.color }}
						>
							<ExternalLink size={13} />
							{t("viewDemo")}
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
