import { useTranslations } from "next-intl";
import { PUBLICATIONS } from "@/features/about/about.data";

/** Papers with authors and venue; titles link to the publication. */
export function PublicationsList() {
	const t = useTranslations("AboutWindow");

	return (
		<ul>
			{PUBLICATIONS.map((pub) => (
				<li
					key={pub.id}
					className="grid grid-cols-[3rem_1fr] gap-x-5 border-t border-(--site-line) py-3.5 first:border-t-0 first:pt-0"
				>
					<p className="tabular-nums text-(--site-muted)">{pub.year}</p>
					<div>
						<a
							href={pub.url}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium leading-snug text-(--site-ink) decoration-ubuntu-orange underline-offset-4 hover:underline"
						>
							{t(pub.titleKey)}
						</a>
						<p className="mt-1 text-(--site-muted)">{t(pub.authorsKey)}</p>
						<p className="text-[0.8125rem] text-(--site-muted)">
							{t(pub.venueKey)}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
}
