import { useLocale, useTranslations } from "next-intl";
import { EDUCATION } from "@/features/about/about.data";
import { formatYearMonth } from "@/lib/format";

/** Degrees and programmes, newest first, with what came out of them. */
export function EducationList() {
	const t = useTranslations("AboutWindow");
	const locale = useLocale();
	const items = [...EDUCATION].sort((a, b) =>
		b.period.start.localeCompare(a.period.start),
	);

	return (
		<ul>
			{items.map((edu) => (
				<li
					key={edu.id}
					className="grid gap-x-10 gap-y-2 border-t border-(--site-line) py-8 first:border-t-0 first:pt-0 md:grid-cols-[12rem_1fr]"
				>
					<p className="tabular-nums text-(--site-muted)">
						<time dateTime={edu.period.start}>
							{formatYearMonth(edu.period.start, locale)}
						</time>
						{" – "}
						<time dateTime={edu.period.end}>
							{formatYearMonth(edu.period.end, locale)}
						</time>
					</p>
					<div>
						<h3 className="text-lg font-medium text-(--site-ink)">
							{edu.url ? (
								<a
									href={edu.url}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline decoration-ubuntu-orange underline-offset-4"
								>
									{t(edu.institutionKey)}
								</a>
							) : (
								t(edu.institutionKey)
							)}
						</h3>
						<p className="mt-1">{t(edu.degreeKey)}</p>
						<p className="mt-1 text-sm text-(--site-muted)">
							{t(edu.highlightKey)}
						</p>
						<ul className="mt-4 max-w-[68ch] list-disc space-y-1.5 pl-5 marker:text-ubuntu-orange">
							{edu.achievementKeys.map((key) => (
								<li key={key}>{t(key)}</li>
							))}
						</ul>
					</div>
				</li>
			))}
		</ul>
	);
}
