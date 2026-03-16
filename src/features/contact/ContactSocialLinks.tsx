"use client";

import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export const SOCIAL_LINKS = [
	{
		icon: Github,
		label: "GitHub",
		href: "https://github.com/agus-darmawan",
		value: "@agus-darmawan",
		color: "#6366f1",
	},
	{
		icon: Linkedin,
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/agusdarmawnn/",
		value: "Agus Darmawan",
		color: "#0ea5e9",
	},
	{
		icon: Mail,
		label: "Email",
		href: "mailto:darmawandeveloper@gmail.com",
		value: "darmawandeveloper@gmail.com",
		color: "#e95420",
	},
	{
		icon: MapPin,
		label: "Location",
		href: null,
		value: "Denpasar, Bali, Indonesia",
		color: "#10b981",
	},
] as const;

export function ContactSocialLinks() {
	return (
		<div className="grid grid-cols-2 gap-2">
			{SOCIAL_LINKS.map(({ icon: Icon, label, href, value, color }) => {
				const inner = (
					<>
						<div
							className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
							style={{ background: `${color}18` }}
						>
							<Icon size={14} style={{ color }} />
						</div>
						<div className="min-w-0">
							<p className="text-[10px] font-medium uppercase tracking-wide text-(--text-muted)">
								{label}
							</p>
							<p className="text-xs truncate font-medium text-(--text-secondary)">
								{value}
							</p>
						</div>
					</>
				);

				if (!href) {
					return (
						<div
							key={label}
							className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-(--surface-secondary) border-(--border)"
						>
							{inner}
						</div>
					);
				}

				return (
					<a
						key={label}
						href={href}
						target={href.startsWith("mailto") ? undefined : "_blank"}
						rel="noreferrer"
						className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-(--surface-secondary) border-(--border) transition-all hover:scale-[1.02]"
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor = `${color}50`;
							(e.currentTarget as HTMLElement).style.background = `${color}08`;
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								"var(--border)";
							(e.currentTarget as HTMLElement).style.background =
								"var(--surface-secondary)";
						}}
					>
						{inner}
					</a>
				);
			})}
		</div>
	);
}
