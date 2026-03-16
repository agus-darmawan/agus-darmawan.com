"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactForm } from "./ContactForm";
import { ContactSocialLinks } from "./ContactSocialLinks";

export default function ContactWindow() {
	const t = useTranslations("ContactWindow");

	return (
		<div
			className="h-full overflow-auto"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* ── Header ─────────────────────────────────────────── */}
			<div
				className="px-6 pt-6 pb-5 border-b relative overflow-hidden"
				style={{
					borderColor: "var(--border)",
					background: "linear-gradient(135deg, #e9542010 0%, transparent 60%)",
				}}
			>
				{/* Ubuntu-style decorative orange bar at top */}
				<div
					className="absolute top-0 left-0 right-0 h-0.5"
					style={{
						background:
							"linear-gradient(90deg, #e95420, #e9542060, transparent)",
					}}
				/>

				<div className="flex items-start gap-3 mb-1">
					<div className="w-9 h-9 rounded-xl bg-ubuntu-orange flex items-center justify-center shadow-md shrink-0">
						<MessageSquare size={16} className="text-white" />
					</div>
					<div>
						<h1 className="text-base font-bold text-(--text-primary) leading-tight">
							{t("title")}
						</h1>
						<p className="text-xs text-(--text-muted) mt-0.5">
							{t("subtitle")}
						</p>
					</div>
				</div>
			</div>

			{/* ── Social links ───────────────────────────────────── */}
			<div
				className="px-6 py-5 border-b"
				style={{ borderColor: "var(--border)" }}
			>
				<p
					className="text-[10px] font-semibold uppercase tracking-widest mb-3"
					style={{ color: "var(--text-muted)" }}
				>
					Find me on
				</p>
				<ContactSocialLinks />
			</div>

			{/* ── Form ───────────────────────────────────────────── */}
			<ContactForm />
		</div>
	);
}
