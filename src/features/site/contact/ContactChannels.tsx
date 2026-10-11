import { useLocale, useTranslations } from "next-intl";
import { resumeUrl, SITE } from "@/config/site";

interface Channel {
	label: string;
	value: string;
	href?: string;
	external?: boolean;
}

/** Email, profiles, location and CV as a definition list. */
export function ContactChannels() {
	const t = useTranslations("ContactWindow");
	const about = useTranslations("AboutWindow");
	const site = useTranslations("Site");
	const cv = resumeUrl(useLocale());

	const channels: Channel[] = [
		{ label: t("emailLabel"), value: SITE.email, href: `mailto:${SITE.email}` },
		{
			label: "LinkedIn",
			value: SITE.shortName,
			href: SITE.socials.LinkedIn,
			external: true,
		},
		{
			label: "GitHub",
			value: `@${SITE.github.username}`,
			href: SITE.socials.GitHub,
			external: true,
		},
		{ label: t("locationLabel"), value: about("location") },
		...(cv ? [{ label: "CV", value: site("footer.cv"), href: cv }] : []),
	];

	return (
		<dl className="border-y border-(--site-line)">
			{channels.map(({ label, value, href, external }) => (
				<div
					key={label}
					className="grid grid-cols-[6rem_1fr] gap-4 border-t border-(--site-line) py-3.5 first:border-t-0 sm:grid-cols-[7rem_1fr]"
				>
					<dt className="text-(--site-muted)">{label}</dt>
					<dd className="min-w-0 break-words">
						{href ? (
							<a
								href={href}
								{...(external && {
									target: "_blank",
									rel: "me noopener noreferrer",
								})}
								className="font-medium text-(--site-ink) decoration-ubuntu-orange underline-offset-4 hover:underline"
							>
								{value}
							</a>
						) : (
							value
						)}
					</dd>
				</div>
			))}
		</dl>
	);
}
