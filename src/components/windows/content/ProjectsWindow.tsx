"use client";

import { ExternalLink, Github, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const PROJECTS = [
	{
		id: "ubuntu-portfolio",
		name: "Ubuntu Portfolio",
		emoji: "🖥️",
		desc: "Interactive OS-themed developer portfolio with draggable windows, Spotify integration, i18n, and dark mode. Built to mimic Ubuntu 22.04 GNOME desktop.",
		tech: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Zustand",
			"TanStack Query",
		],
		github: "https://github.com/agus-darmawan/ubuntu-portfolio",
		demo: "https://agus.dev",
		stars: 48,
		featured: true,
		category: "web",
		color: "#e95420",
	},
	{
		id: "taskflow",
		name: "TaskFlow",
		emoji: "📋",
		desc: "Real-time project management app with drag-and-drop kanban boards, team collaboration, activity feeds, and AI-powered task suggestions using OpenAI.",
		tech: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis", "OpenAI"],
		github: "https://github.com/agus-darmawan/taskflow",
		demo: "https://taskflow.agus.dev",
		stars: 31,
		featured: true,
		category: "web",
		color: "#3b82f6",
	},
	{
		id: "weathervue",
		name: "WeatherVue",
		emoji: "🌤️",
		desc: "Weather dashboard with interactive D3.js charts, multi-location tracking, 7-day forecasts, and customizable widget layouts with local storage persistence.",
		tech: ["Vue 3", "D3.js", "Pinia", "TypeScript", "OpenWeather API"],
		github: "https://github.com/agus-darmawan/weathervue",
		demo: "https://weathervue.agus.dev",
		stars: 19,
		featured: true,
		category: "web",
		color: "#06b6d4",
	},
	{
		id: "cli-tools",
		name: "devkit-cli",
		emoji: "⚡",
		desc: "Collection of developer productivity CLI tools including project scaffolding, git workflow automation, and environment setup scripts.",
		tech: ["Python", "Click", "Rich", "Shell"],
		github: "https://github.com/agus-darmawan/devkit-cli",
		demo: null,
		stars: 12,
		featured: false,
		category: "cli",
		color: "#8b5cf6",
	},
	{
		id: "bali-umkm",
		name: "Bali UMKM Platform",
		emoji: "🛒",
		desc: "E-commerce platform connecting local Balinese artisans with customers, featuring product showcase, online ordering, and integrated local payment gateway.",
		tech: ["Next.js", "Stripe", "Prisma", "PostgreSQL", "Cloudinary"],
		github: "https://github.com/agus-darmawan/bali-umkm",
		demo: "https://bali-umkm.vercel.app",
		stars: 9,
		featured: false,
		category: "web",
		color: "#f59e0b",
	},
	{
		id: "react-motion",
		name: "react-snap-scroll",
		emoji: "🎨",
		desc: "Lightweight React hook library for smooth snap scrolling with customizable easing, direction support, and accessibility features.",
		tech: ["React", "TypeScript", "Rollup", "Vitest"],
		github: "https://github.com/agus-darmawan/react-snap-scroll",
		demo: null,
		stars: 7,
		featured: false,
		category: "library",
		color: "#10b981",
	},
];

type Category = "all" | "web" | "cli" | "library";

export default function ProjectsWindow() {
	const t = useTranslations("ProjectsWindow");
	const [filter, setFilter] = useState<Category>("all");

	const categories: { key: Category; label: string }[] = [
		{ key: "all", label: t("allProjects") },
		{ key: "web", label: "Web Apps" },
		{ key: "cli", label: "CLI" },
		{ key: "library", label: "Libraries" },
	];

	const filtered =
		filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* Header + Filter */}
			<div
				className="px-5 pt-5 pb-3 border-b shrink-0"
				style={{ borderColor: "var(--border)" }}
			>
				<div className="flex items-center justify-between mb-3">
					<h1 className="text-lg font-bold">{t("title")}</h1>
					<span
						className="text-xs px-2 py-0.5 rounded-full"
						style={{
							background: "#e9542018",
							color: "#e95420",
							border: "1px solid #e9542030",
						}}
					>
						{PROJECTS.length} {t("title").toLowerCase()}
					</span>
				</div>

				{/* Category Filter */}
				<div className="flex gap-1.5">
					{categories.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => setFilter(key)}
							className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
							style={
								filter === key
									? { background: "#e95420", color: "white" }
									: {
											background: "var(--surface-secondary)",
											color: "var(--text-secondary)",
											border: "1px solid var(--border)",
										}
							}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Projects Grid */}
			<div className="flex-1 overflow-auto px-5 py-4">
				{/* Featured */}
				{filter === "all" && (
					<p
						className="text-xs font-medium uppercase tracking-wider mb-3"
						style={{ color: "var(--text-muted)" }}
					>
						⭐ {t("featured")}
					</p>
				)}

				<div className="grid grid-cols-1 gap-3">
					{filtered.map((project) => (
						<div
							key={project.id}
							className="rounded-xl border overflow-hidden transition-all group"
							style={{
								background: "var(--surface-secondary)",
								borderColor: "var(--border)",
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor =
									project.color;
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor =
									"var(--border)";
							}}
						>
							{/* Card top strip */}
							<div
								className="h-1"
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
													className="text-xs px-1.5 py-0.5 rounded-full font-medium"
													style={{
														background: `${project.color}18`,
														color: project.color,
													}}
												>
													Featured
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

								{/* Tech + Actions */}
								<div className="flex items-center justify-between mt-3 flex-wrap gap-2">
									<div className="flex flex-wrap gap-1">
										{project.tech.slice(0, 4).map((tech) => (
											<span
												key={tech}
												className="text-xs px-1.5 py-0.5 rounded"
												style={{
													background: "var(--border)",
													color: "var(--text-muted)",
												}}
											>
												{tech}
											</span>
										))}
										{project.tech.length > 4 && (
											<span
												className="text-xs px-1.5 py-0.5 rounded"
												style={{ color: "var(--text-muted)" }}
											>
												+{project.tech.length - 4}
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

										<a
											href={project.github}
											target="_blank"
											rel="noreferrer"
											className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors"
											style={{
												color: "var(--text-secondary)",
												borderColor: "var(--border)",
												background: "var(--window-bg)",
											}}
											onMouseEnter={(e) => {
												(e.currentTarget as HTMLElement).style.borderColor =
													project.color;
												(e.currentTarget as HTMLElement).style.color =
													project.color;
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
												className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-white transition-opacity"
												style={{ background: project.color }}
												onMouseEnter={(e) => {
													(e.currentTarget as HTMLElement).style.opacity =
														"0.85";
												}}
												onMouseLeave={(e) => {
													(e.currentTarget as HTMLElement).style.opacity = "1";
												}}
											>
												<ExternalLink size={11} />
												{t("viewDemo")}
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
