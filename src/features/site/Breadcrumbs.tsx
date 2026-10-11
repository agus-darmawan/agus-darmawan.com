import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface Crumb {
	name: string;
	href: string;
}

/** Trail above detail pages; the last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
	const t = useTranslations("Site");

	return (
		<nav
			aria-label={t("breadcrumb")}
			className="pt-8 text-sm text-(--site-muted)"
		>
			<ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
				{items.map((crumb, i) => {
					const last = i === items.length - 1;
					return (
						<li key={crumb.href} className="flex min-w-0 items-center gap-2">
							{i > 0 && (
								<span aria-hidden="true" className="text-(--site-line)">
									/
								</span>
							)}
							{last ? (
								<span
									aria-current="page"
									className="truncate text-(--site-text)"
								>
									{crumb.name}
								</span>
							) : (
								<Link href={crumb.href} className="hover:text-(--site-ink)">
									{crumb.name}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
