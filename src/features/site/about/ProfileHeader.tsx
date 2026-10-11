import { Download, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { resumeUrl, SITE } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonClass, textLinkClass } from "../button";
import { DISPLAY_HEADING } from "../typography";

/** Photo, name, role, bio and the ways to follow up. */
export function ProfileHeader() {
	const t = useTranslations("Site");
	const about = useTranslations("AboutWindow");
	const seo = useTranslations("Seo");
	const cv = resumeUrl(useLocale());

	return (
		<header className="grid gap-8 pb-14 pt-14 sm:pt-20 md:grid-cols-[auto_1fr] md:gap-12">
			<Image
				src="/avatar.png"
				alt={about("name")}
				width={160}
				height={160}
				priority
				sizes="(min-width: 640px) 160px, 112px"
				className="size-28 rounded-full object-cover ring-1 ring-(--site-line) sm:size-40"
			/>
			<div className="min-w-0">
				<h1 className={DISPLAY_HEADING}>{about("name")}</h1>
				<p className="mt-3 text-xl text-(--site-ink)">{t("hero.role")}</p>
				<p className="mt-2 flex items-center gap-1.5 text-(--site-muted)">
					<MapPin className="size-4 shrink-0" aria-hidden />
					{about("location")}
				</p>
				<p className="mt-6 max-w-[65ch] text-lg leading-relaxed">
					{about("bio")}
				</p>
				<div className="mt-8 flex flex-wrap items-center gap-3">
					{cv && (
						<a href={cv} className={buttonClass("primary")}>
							<Download className="size-4" aria-hidden />
							{seo("downloadCv")}
						</a>
					)}
					<a href={`mailto:${SITE.email}`} className={buttonClass("secondary")}>
						<Mail className="size-4" aria-hidden />
						{seo("emailMe")}
					</a>
					<Link href="/experience" className={cn(textLinkClass, "px-2")}>
						{t("about.seeExperience")}
					</Link>
				</div>
			</div>
		</header>
	);
}
