import { Award, GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { formatYearMonth } from "@/lib/format";
import { AboutSection } from "./AboutSection";
import { EDUCATION } from "./about.data";

export function AboutEducation() {
	const t = useTranslations("AboutWindow");
	const locale = useLocale();

	return (
		<AboutSection title={t("education")}>
			<div className="space-y-3">
				{EDUCATION.map((edu) => (
					<article
						key={edu.id}
						style={accentStyle(edu.color)}
						className="p-3 rounded-xl border bg-(--accent)/3 border-(--accent)/12"
					>
						<div className="flex items-start gap-3">
							<span
								aria-hidden="true"
								className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-(--accent)/10 border border-(--accent)/15 text-(--accent)"
							>
								<GraduationCap size={16} />
							</span>

							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2 flex-wrap">
									<h3 className="text-xs font-bold leading-snug text-(--text-primary)">
										{t(edu.institutionKey)}
									</h3>
									<span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 bg-(--accent)/10 text-(--accent)">
										{t(edu.highlightKey)}
									</span>
								</div>
								<p className="text-[11px] mt-0.5 font-medium text-(--accent)">
									{t(edu.degreeKey)}
								</p>
								<p className="text-[10px] mt-0.5 tabular-nums text-(--text-muted)">
									<time dateTime={edu.period.start}>
										{formatYearMonth(edu.period.start, locale)}
									</time>
									{" – "}
									<time dateTime={edu.period.end}>
										{formatYearMonth(edu.period.end, locale)}
									</time>
								</p>

								<ul className="mt-2 space-y-1">
									{edu.achievementKeys.map((key) => (
										<li
											key={key}
											className="flex items-start gap-1.5 text-[11px] text-(--text-secondary)"
										>
											<Award
												size={10}
												aria-hidden="true"
												className="shrink-0 mt-0.5 text-(--accent)"
											/>
											<span>{t(key)}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</article>
				))}
			</div>
		</AboutSection>
	);
}
