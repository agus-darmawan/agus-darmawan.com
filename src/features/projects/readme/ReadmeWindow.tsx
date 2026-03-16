"use client";

import { Github, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { ProjectMeta } from "../projects.data";
import { ReadmeRenderer } from "./ReadmeRenderer";

const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL ?? "";

interface ReadmeWindowProps {
	project: ProjectMeta;
	name: string;
	desc: string;
	readmeFile: string;
}

export default function ReadmeWindow({
	project,
	name,
	desc,
	readmeFile,
}: ReadmeWindowProps) {
	const locale = useLocale();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [readmeContent, setReadmeContent] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setReadmeContent(null);

		fetch(`${CONTENT_URL}/readme/${locale}/${readmeFile}.mdx`, {
			signal: controller.signal,
		})
			.then((r) => (r.ok ? r.text() : Promise.reject(new Error("not found"))))
			.then((text) => setReadmeContent(text))
			.catch((err) => {
				// Ignore AbortError — component unmount sebelum fetch selesai
				if (err.name !== "AbortError") {
					setReadmeContent(`# ${name}\n\n${desc}`);
				}
			})
			.finally(() => setLoading(false));

		// Cancel request kalau locale/file berubah atau component unmount
		return () => controller.abort();
	}, [locale, readmeFile, name, desc]);

	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* ── Sub-header ──────────────────────────────────────── */}
			<div
				className="px-4 py-3 border-b shrink-0 flex items-center gap-3"
				style={{
					borderColor: "var(--border)",
					background: `linear-gradient(135deg, ${project.color}12 0%, transparent 60%)`,
				}}
			>
				<div
					className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
					style={{ background: `${project.color}20` }}
				>
					{project.emoji}
				</div>

				<div className="flex-1 min-w-0">
					<h2
						className="text-sm font-bold truncate"
						style={{ color: "var(--text-primary)" }}
					>
						{name}
					</h2>
					<p
						className="text-xs truncate"
						style={{ color: "var(--text-muted)" }}
					>
						{desc}
					</p>
				</div>

				<a
					href={project.github}
					target="_blank"
					rel="noreferrer"
					className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors shrink-0"
					style={{
						color: "var(--text-secondary)",
						borderColor: "var(--border)",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.borderColor = project.color;
						(e.currentTarget as HTMLElement).style.color = project.color;
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.borderColor =
							"var(--border)";
						(e.currentTarget as HTMLElement).style.color =
							"var(--text-secondary)";
					}}
				>
					<Github size={12} />
					GitHub
				</a>
			</div>

			{/* ── Tech badges ─────────────────────────────────────── */}
			<div
				className="px-4 py-2 flex flex-wrap gap-1.5 border-b shrink-0"
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

			{/* ── README content ──────────────────────────────────── */}
			<div ref={scrollRef} className="flex-1 overflow-auto min-h-0 px-5 py-4">
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<Loader2
							size={22}
							className="animate-spin"
							style={{ color: project.color }}
						/>
					</div>
				) : (
					<ReadmeRenderer
						content={readmeContent ?? ""}
						accentColor={project.color}
						scrollRef={scrollRef}
					/>
				)}
			</div>
		</div>
	);
}
