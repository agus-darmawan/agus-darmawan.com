"use client";

import { Mail, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { WindowHero } from "@/components/window/WindowHero";
import { ContactForm } from "./ContactForm";
import { ContactSocialLinks } from "./ContactSocialLinks";

export default function ContactWindow() {
	const t = useTranslations("ContactWindow");

	return (
		<div className="h-full overflow-auto bg-(--window-bg) text-(--text-primary)">
			<WindowHero
				accent="#8b5cf6"
				accentTo="#6366f150"
				decoration="wave"
				icon={<MessageSquare size={15} className="text-white" />}
				title={t("title")}
				subtitle={t("subtitle")}
				description={t("headerDesc")}
			>
				<div className="flex items-center gap-2">
					<Mail size={10} aria-hidden="true" className="text-(--text-muted)" />
					<span className="text-[9px] font-semibold uppercase tracking-widest text-(--text-muted)">
						{t("findMe")}
					</span>
					<div className="flex-1 h-px bg-linear-to-r from-(--border) to-transparent" />
				</div>
			</WindowHero>

			<div className="px-6 py-4 border-b border-(--border)">
				<ContactSocialLinks />
			</div>

			<ContactForm />
		</div>
	);
}
