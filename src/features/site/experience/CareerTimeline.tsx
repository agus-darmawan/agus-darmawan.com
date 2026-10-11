import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { EXPERIENCES } from "@/features/experience/experience.data";
import { companySpan } from "@/features/experience/experience.utils";
import { Period } from "./Period";

/**
 * Every organization with its roles on one rail — promotions read as
 * consecutive stops. The company column sticks while its roles scroll.
 */
export function CareerTimeline() {
	const t = useTranslations("ExperienceWindow");
	const tExp = useTranslations("Experience");

	return (
		<ol>
			{EXPERIENCES.map((entry) => {
				const span = companySpan(entry);
				return (
					<li
						key={entry.i18nKey}
						style={accentStyle(entry.color)}
						className="grid gap-x-12 gap-y-6 border-t border-(--site-line) py-12 first:border-t-0 first:pt-0 lg:grid-cols-[16rem_1fr]"
					>
						<div className="lg:sticky lg:top-24 lg:self-start">
							<h2 className="text-xl font-medium leading-snug text-(--site-ink)">
								{tExp(`${entry.i18nKey}.company`)}
							</h2>
							<p className="mt-1.5 text-(--site-muted)">
								{tExp(`${entry.i18nKey}.location`)}
							</p>
							<p className="mt-1 text-sm tabular-nums text-(--site-muted)">
								<Period start={span.start} end={span.end} />
							</p>
						</div>

						<ol className="space-y-10 border-l-2 border-(--accent)/30 pl-6 sm:pl-8">
							{entry.roles.map((role) => {
								const base = `${entry.i18nKey}.roles.${role.i18nKey}`;
								const responsibilities = tExp.raw(`${base}.responsibilities`) as
									| string[]
									| undefined;
								return (
									<li key={role.i18nKey} className="relative">
										<span
											aria-hidden="true"
											className="absolute top-2 -left-[calc(1.5rem+6px)] size-2.5 rounded-full bg-(--accent) ring-4 ring-(--site-bg) sm:-left-[calc(2rem+6px)]"
										/>
										<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
											<h3 className="text-lg font-medium text-(--site-ink)">
												{tExp(`${base}.title`)}
											</h3>
											<p className="text-sm tabular-nums text-(--site-muted)">
												<Period
													start={role.period.start}
													end={role.period.end}
												/>
											</p>
										</div>
										{responsibilities && responsibilities.length > 0 && (
											<ul className="mt-4 max-w-[70ch] list-disc space-y-2 pl-5 leading-relaxed marker:text-(--accent)">
												{responsibilities.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										)}
										<ul
											aria-label={t("techStack")}
											className="mt-4 flex flex-wrap gap-1.5"
										>
											{role.tech.map((tech) => (
												<li
													key={tech}
													className="rounded-md bg-(--site-raised) px-2 py-0.5 text-[0.8125rem] text-(--site-muted)"
												>
													{tech}
												</li>
											))}
										</ul>
									</li>
								);
							})}
						</ol>
					</li>
				);
			})}
		</ol>
	);
}
