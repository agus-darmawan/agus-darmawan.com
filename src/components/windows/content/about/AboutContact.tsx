"use client";

import { Github, Globe, Linkedin, Mail } from "lucide-react";

const LINKS = [
	{
		icon: Github,
		label: "GitHub",
		href: "https://github.com/agus-darmawan",
		value: "agus-darmawan",
	},
	{
		icon: Linkedin,
		label: "LinkedIn",
		href: "https://linkedin.com/in/agus-darmawan",
		value: "agus-darmawan",
	},
	{
		icon: Mail,
		label: "Email",
		href: "mailto:agus@example.com",
		value: "agus@example.com",
	},
	{
		icon: Globe,
		label: "Website",
		href: "https://agus.dev",
		value: "agus.dev",
	},
] as const;

interface AboutContactProps {
	t: (key: string) => string;
}

export function AboutContact({ t }: AboutContactProps) {
	return (
		<div className="px-6 py-5">
			<h2
				className="text-xs font-semibold uppercase tracking-wider mb-4"
				style={{ color: "var(--text-muted)" }}
			>
				{t("connect")}
			</h2>

			<div className="grid grid-cols-2 gap-2">
				{LINKS.map(({ icon: Icon, label, href, value }) => (
					<a
						key={label}
						href={href}
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all group"
						style={{
							background: "var(--surface-secondary)",
							borderColor: "var(--border)",
							color: "var(--text-secondary)",
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor = "#e95420";
							(e.currentTarget as HTMLElement).style.color = "#e95420";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								"var(--border)";
							(e.currentTarget as HTMLElement).style.color =
								"var(--text-secondary)";
						}}
					>
						<Icon size={14} className="shrink-0" />
						<div className="min-w-0">
							<p className="text-[10px] font-medium uppercase tracking-wide opacity-60">
								{label}
							</p>
							<p className="text-xs truncate font-medium">{value}</p>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
