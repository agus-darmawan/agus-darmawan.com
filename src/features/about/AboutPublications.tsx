import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { AboutSection } from "./AboutSection";
import { PUBLICATIONS } from "./about.data";

export function AboutPublications() {
	const t = useTranslations("AboutWindow");

	return (
		<AboutSection title={t("publications")}>
			<ul className="space-y-3">
				{PUBLICATIONS.map((pub) => (
					<li
						key={pub.id}
						style={accentStyle(pub.color)}
						className="p-3.5 rounded-xl border transition-colors duration-200 bg-(--accent)/2 border-(--accent)/12 hover:bg-(--accent)/5 hover:border-(--accent)/25"
					>
						<div className="flex items-start gap-2.5">
							<span
								aria-hidden="true"
								className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-(--accent)/10 text-(--accent)"
							>
								<BookOpen size={13} />
							</span>

							<div className="flex-1 min-w-0">
								<h3 className="text-xs font-semibold leading-snug mb-1 text-(--text-primary)">
									{t(pub.titleKey)}
								</h3>
								<p className="text-[11px] mb-1.5 text-(--text-muted)">
									{t(pub.authorsKey)}
								</p>

								<div className="flex items-center justify-between flex-wrap gap-2">
									<span className="text-[10px] font-medium text-(--accent)">
										{t(pub.venueKey)}
									</span>
									<div className="flex items-center gap-2 shrink-0">
										<span className="text-[10px] tabular-nums text-(--text-muted)">
											{pub.year}
										</span>
										<a
											href={pub.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium transition-opacity hover:opacity-80 bg-(--accent)/10 text-(--accent) border border-(--accent)/20"
										>
											{t("readPublication")}
										</a>
									</div>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</AboutSection>
	);
}
