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
import { HERO_HEADING } from "../typography";
import { DesktopPreview } from "./DesktopPreview";

/** Who, what, where now — and the door into the desktop. */
export function HomeHero({ preview }: { preview: ProjectMeta[] }) {
	const t = useTranslations("Site.hero");
	const about = useTranslations("AboutWindow");
	const tExp = useTranslations("Experience");
	const cv = resumeUrl(useLocale());
	const now = currentRole(EXPERIENCES);

	return (
		<header className="grid items-center gap-x-14 gap-y-12 pt-12 pb-14 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:pb-16">
			<div className="min-w-0">
				<h1 className={HERO_HEADING}>{about("name")}</h1>
				<p className="mt-3 text-[1.0625rem] text-(--site-ink)">{t("role")}</p>
				<p className="mt-5 max-w-[56ch] text-base leading-relaxed">
					{t("lede")}
				</p>

				{now && (
					<p className="mt-6 flex items-center gap-3 text-(--site-ink)">
						<Image
							src="/avatar.png"
							alt=""
							width={36}
							height={36}
							priority
							className="size-9 shrink-0 rounded-full object-cover ring-1 ring-(--site-line)"
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

				<div className="mt-8 flex flex-wrap items-center gap-2.5">
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
