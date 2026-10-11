import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonClass } from "../button";
import { LEDE } from "../typography";

/** Closing invitation: one question, two ways to answer it. */
export function ContactCta() {
	const t = useTranslations("Site.cta");

	return (
		<section
			aria-labelledby="cta-heading"
			className="border-t border-(--site-line) py-16 sm:py-20"
		>
			<h2
				id="cta-heading"
				className="max-w-[26ch] text-[clamp(1.5rem,2.8vw,2.125rem)] font-light leading-[1.2] tracking-[-0.015em] text-(--site-ink)"
			>
				{t("title")}
			</h2>
			<p className={cn(LEDE, "mt-4 max-w-[52ch]")}>{t("body")}</p>
			<div className="mt-8 flex flex-wrap gap-2.5">
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
