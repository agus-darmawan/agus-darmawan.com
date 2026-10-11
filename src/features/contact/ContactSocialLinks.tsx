import { Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { SITE } from "@/config/site";
import { GithubIcon, LinkedinIcon } from "@/features/icons/BrandIcons";

const CARD =
	"flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-(--surface-secondary) border-(--border)";

export function ContactSocialLinks() {
	const t = useTranslations("ContactWindow");
	const about = useTranslations("AboutWindow");

	const links = [
		{
			icon: GithubIcon,
			label: "GitHub",
			href: SITE.socials.GitHub,
			value: `@${SITE.github.username}`,
			color: "#6366f1",
		},
		{
			icon: LinkedinIcon,
			label: "LinkedIn",
			href: SITE.socials.LinkedIn,
			value: SITE.shortName,
			color: "#0ea5e9",
		},
		{
			icon: Mail,
			label: t("emailLabel"),
			href: `mailto:${SITE.email}`,
			value: SITE.email,
			color: "#e95420",
		},
		{
			icon: MapPin,
			label: t("locationLabel"),
			href: null,
			value: about("location"),
			color: "#10b981",
		},
	];

	return (
		<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
			{links.map(({ icon: Icon, label, href, value, color }) => {
				const inner = (
					<>
						<span
							aria-hidden="true"
							className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-(--accent)/10 text-(--accent)"
						>
							<Icon size={14} />
						</span>
						<span className="min-w-0">
							<span className="block text-[10px] font-medium uppercase tracking-wide text-(--text-muted)">
								{label}
							</span>
							<span className="block text-xs truncate font-medium text-(--text-secondary)">
								{value}
							</span>
						</span>
					</>
				);

				return (
					<li key={label} style={accentStyle(color)}>
						{href ? (
							<a
								href={href}
								target={href.startsWith("mailto:") ? undefined : "_blank"}
								rel="noopener noreferrer me"
								className={`${CARD} transition-all hover:scale-[1.02] hover:border-(--accent)/30 hover:bg-(--accent)/3`}
							>
								{inner}
							</a>
						) : (
							<div className={CARD}>{inner}</div>
						)}
					</li>
				);
			})}
		</ul>
	);
}
