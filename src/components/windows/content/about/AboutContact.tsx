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
		href: "https://www.linkedin.com/in/agusdarmawnn/",
		value: "Agus Darmawan",
	},
	{
		icon: Mail,
		label: "Email",
		href: "mailto:darmawandeveloper@gmail.com",
		value: "darmawandeveloper@gmail.com",
	},
	{
		icon: Globe,
		label: "Website",
		href: "https://agus-darmawan.com",
		value: "agus-darmawan",
	},
] as const;

interface AboutContactProps {
	t: (key: string) => string;
}

export function AboutContact({ t }: AboutContactProps) {
	return (
		<div className="px-6 py-5">
			<h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
				{t("connect")}
			</h2>

			<div className="grid grid-cols-2 gap-2">
				{LINKS.map(({ icon: Icon, label, href, value }) => (
					<a
						key={label}
						href={href}
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border
						bg-(--surface-secondary) border-(--border) text-(--text-secondary)
						transition-all
						hover:border-ubuntu-orange hover:text-ubuntu-orange"
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
