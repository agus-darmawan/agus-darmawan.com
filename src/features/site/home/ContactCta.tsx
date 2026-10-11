import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "../button";

/** Closing invitation: one question, two ways to answer it. */
export function ContactCta() {
	const t = useTranslations("Site.cta");

	return (
		<section
			aria-labelledby="cta-heading"
			className="border-t border-(--site-line) py-20 sm:py-28"
		>
			<h2
				id="cta-heading"
				className="max-w-[24ch] text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-[1.15] tracking-[-0.015em] text-(--site-ink)"
			>
				{t("title")}
			</h2>
			<p className="mt-5 max-w-[52ch] text-lg text-(--site-muted)">
				{t("body")}
			</p>
			<div className="mt-9 flex flex-wrap gap-3">
				<a href={`mailto:${SITE.email}`} className={buttonClass("primary")}>
					<Mail className="size-4" aria-hidden />
					{t("email")}
				</a>
				<Link href="/contact" className={buttonClass("secondary")}>
					{t("form")}
				</Link>
			</div>
		</section>
	);
}
