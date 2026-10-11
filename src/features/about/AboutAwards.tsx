import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { AboutSection } from "./AboutSection";
import { AWARDS, LEVEL_COLORS } from "./about.data";

export function AboutAwards() {
	const t = useTranslations("AboutWindow");

	return (
		<AboutSection title={t("awards")}>
			<ul className="space-y-2.5">
				{AWARDS.map((award) => (
					<li
						key={`${award.event}-${award.title}`}
						style={accentStyle(award.color)}
						className="flex items-start gap-3 p-3 rounded-xl border bg-(--surface-secondary) border-(--border) transition-colors hover:border-(--accent)/25 hover:bg-(--accent)/3"
					>
						<span aria-hidden="true" className="text-xl shrink-0">
							{award.emoji}
						</span>
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2 flex-wrap">
								<h3 className="text-xs font-bold text-(--text-primary) leading-snug">
									{award.title}
								</h3>
								<div className="flex items-center gap-1.5 shrink-0">
									<span
										style={accentStyle(LEVEL_COLORS[award.level])}
										className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-(--accent)/10 text-(--accent)"
									>
										{t(award.level)}
									</span>
									<span className="text-[10px] text-(--text-muted)">
										{award.year}
									</span>
								</div>
							</div>
							<p className="text-[11px] mt-0.5 text-(--text-muted)">
								{award.event}
							</p>
						</div>
					</li>
				))}
			</ul>
		</AboutSection>
	);
}
