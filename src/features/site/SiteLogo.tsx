import { SITE } from "@/config/site";
import { Link } from "@/i18n/navigation";

/** Ring-and-dot mark plus the name; always links home. */
export function SiteLogo() {
	return (
		<Link
			href="/"
			className="group flex shrink-0 items-center gap-2.5 font-medium text-(--site-ink)"
		>
			<span
				aria-hidden="true"
				className="grid size-6 place-items-center rounded-full border-[2.5px] border-ubuntu-orange transition-transform duration-300 group-hover:rotate-90"
			>
				<span className="size-1.5 rounded-full bg-ubuntu-orange" />
			</span>
			<span className="text-[0.9375rem] tracking-tight">{SITE.shortName}</span>
		</Link>
	);
}
