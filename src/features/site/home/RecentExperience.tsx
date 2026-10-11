import { useTranslations } from "next-intl";
import { EXPERIENCES } from "@/features/experience/experience.data";
import { byRecency } from "@/features/experience/experience.utils";
import { Period } from "../experience/Period";

/** The latest organizations, one line each: when, which role, where. */
export function RecentExperience({ limit = 4 }: { limit?: number }) {
	const tExp = useTranslations("Experience");

	return (
		<ol>
			{byRecency(EXPERIENCES)
				.slice(0, limit)
				.map(({ entry, start, end, latestRole }) => (
					<li
						key={entry.i18nKey}
						className="grid gap-x-10 gap-y-1 border-t border-(--site-line) py-5 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_1fr]"
					>
						<p className="tabular-nums text-(--site-muted) sm:pt-0.5">
							<Period start={start} end={end} />
						</p>
						<div className="min-w-0">
							<p className="text-lg font-medium text-(--site-ink)">
								{tExp(`${entry.i18nKey}.roles.${latestRole.i18nKey}.title`)}
							</p>
							<p className="mt-0.5 text-(--site-muted)">
								{tExp(`${entry.i18nKey}.company`)}
							</p>
						</div>
					</li>
				))}
		</ol>
	);
}
