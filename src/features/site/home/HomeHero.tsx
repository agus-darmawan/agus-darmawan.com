import { Download } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { resumeUrl } from "@/config/site";
import { EXPERIENCES } from "@/features/experience/experience.data";
import { currentRole } from "@/features/experience/experience.utils";
import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { buttonClass, textLinkClass } from "../button";
import { DISPLAY_HEADING } from "../typography";
import { DesktopPreview } from "./DesktopPreview";

/** Who, what, where now — and the door into the desktop. */
export function HomeHero({ preview }: { preview: ProjectMeta[] }) {
	const t = useTranslations("Site.hero");
	const about = useTranslations("AboutWindow");
	const tExp = useTranslations("Experience");
	const cv = resumeUrl(useLocale());
	const now = currentRole(EXPERIENCES);

	return (
		<header className="grid items-center gap-x-16 gap-y-14 pt-14 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:pb-20">
			<div className="min-w-0">
				<h1 className={DISPLAY_HEADING}>{about("name")}</h1>
				<p className="mt-3 text-xl text-(--site-ink)">{t("role")}</p>
				<p className="mt-6 max-w-[58ch] text-lg leading-relaxed">{t("lede")}</p>

				{now && (
					<p className="mt-7 flex items-center gap-3 text-(--site-ink)">
						<Image
							src="/avatar.png"
							alt=""
							width={40}
							height={40}
							priority
							className="size-10 shrink-0 rounded-full object-cover ring-1 ring-(--site-line)"
						/>
						<span>
							{t("now", {
								role: tExp(
									`${now.entry.i18nKey}.roles.${now.role.i18nKey}.title`,
								),
								company: tExp(`${now.entry.i18nKey}.company`),
							})}
						</span>
					</p>
				)}

				<div className="mt-9 flex flex-wrap items-center gap-3">
					<Link href="/projects" className={buttonClass("primary")}>
						{t("seeProjects")}
					</Link>
					<Link href="/contact" className={buttonClass("secondary")}>
						{t("getInTouch")}
					</Link>
					{cv && (
						<a
							href={cv}
							className={cn(
								textLinkClass,
								"inline-flex items-center gap-1.5 px-2",
							)}
						>
							<Download className="size-4" aria-hidden />
							{t("downloadCv")}
						</a>
					)}
				</div>
			</div>

			<DesktopPreview projects={preview} />
		</header>
	);
}
