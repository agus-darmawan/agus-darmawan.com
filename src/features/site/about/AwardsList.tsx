import { useTranslations } from "next-intl";
import { AWARDS } from "@/features/about/about.data";

/** Awards by year, newest first. */
export function AwardsList({ limit }: { limit?: number }) {
	const t = useTranslations("AboutWindow");
	const items = [...AWARDS]
		.sort((a, b) => b.year.localeCompare(a.year))
		.slice(0, limit);

	return (
		<ul>
			{items.map((award) => (
				<li
					key={`${award.event}-${award.title}`}
					className="grid grid-cols-[3.5rem_1fr] gap-x-5 border-t border-(--site-line) py-4 first:border-t-0 first:pt-0 sm:grid-cols-[3.5rem_1fr_auto]"
				>
					<p className="tabular-nums text-(--site-muted)">{award.year}</p>
					<div>
						<p className="font-medium text-(--site-ink)">{award.title}</p>
						<p className="mt-0.5 text-(--site-muted)">{award.event}</p>
					</div>
					<p className="col-start-2 mt-1 text-sm text-(--site-muted) sm:col-start-3 sm:mt-0">
						{t(award.level)}
					</p>
				</li>
			))}
		</ul>
	);
}
