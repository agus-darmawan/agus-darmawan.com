"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT_LIMITS } from "@/lib/contact/schema";
import { cn } from "@/lib/utils";
import { ContactInputField, ContactTextareaField } from "./ContactFormField";
import { useContactForm } from "./hooks/useContactForm";

export function ContactForm() {
	const t = useTranslations("ContactWindow");
	const {
		fields,
		setField,
		website,
		setWebsite,
		status,
		failure,
		canSubmit,
		submit,
		turnstile,
	} = useContactForm();
	const busy = status === "sending";

	return (
		<form
			className="px-6 py-5"
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				void submit();
			}}
		>
			<div className="flex items-center gap-2 mb-4">
				<div className="h-px flex-1 bg-(--border)" aria-hidden="true" />
				<h2 className="text-[10px] font-semibold uppercase tracking-widest shrink-0 text-(--text-muted)">
					{t("sendMessage")}
				</h2>
				<div className="h-px flex-1 bg-(--border)" aria-hidden="true" />
			</div>

			<div className="space-y-3">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<ContactInputField
						id="contact-name"
						label={t("nameLabel")}
						placeholder={t("namePlaceholder")}
						type="text"
						value={fields.name}
						onChange={(e) => setField("name")(e.target.value)}
						disabled={busy}
						autoComplete="name"
						maxLength={CONTACT_LIMITS.name}
						required
					/>
					<ContactInputField
						id="contact-email"
						label={t("emailLabel")}
						placeholder={t("emailPlaceholder")}
						type="email"
						value={fields.email}
						onChange={(e) => setField("email")(e.target.value)}
						disabled={busy}
						autoComplete="email"
						maxLength={CONTACT_LIMITS.email}
						required
					/>
				</div>

				<ContactTextareaField
					id="contact-message"
					label={t("messageLabel")}
					placeholder={t("messagePlaceholder")}
					value={fields.message}
					onChange={(e) => setField("message")(e.target.value)}
					rows={4}
					disabled={busy}
					maxLength={CONTACT_LIMITS.message}
					required
				/>

				{/* Honeypot: hidden from people and assistive tech, bots fill it. */}
				<input
					type="text"
					name="website"
					value={website}
					onChange={(e) => setWebsite(e.target.value)}
					tabIndex={-1}
					autoComplete="off"
					aria-hidden="true"
					className="absolute -left-[9999px] h-px w-px opacity-0"
				/>

				{turnstile.siteKey && (
					<Turnstile
						ref={turnstile.ref}
						siteKey={turnstile.siteKey}
						onSuccess={turnstile.onToken}
						onError={() => turnstile.onToken(null)}
						onExpire={() => turnstile.onToken(null)}
						// Only shows up when Cloudflare actually needs an interaction;
						// works for managed and non-interactive site keys.
						options={{
							theme: "auto",
							size: "flexible",
							appearance: "interaction-only",
						}}
					/>
				)}

				<div aria-live="polite" role="status">
					{status === "error" && failure && (
						<p className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-[#c7162b]/10 border border-[#c7162b]/20 text-[#c7162b]">
							<AlertCircle size={13} className="shrink-0" aria-hidden="true" />
							{t(`errors.${failure}`)}
						</p>
					)}
					{status === "sent" && (
						<p className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981]">
							<CheckCircle2 size={13} className="shrink-0" aria-hidden="true" />
							{t("sent")}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={!canSubmit}
					className={cn(
						"w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
						status === "sent"
							? "bg-[#10b981]"
							: status === "error"
								? "bg-[#c7162b]"
								: "bg-[#e95420]",
					)}
				>
					{busy ? (
						<>
							<Loader2 size={14} className="animate-spin" aria-hidden="true" />
							{t("sending")}
						</>
					) : status === "sent" ? (
						<>
							<CheckCircle2 size={14} aria-hidden="true" />
							{t("sent")}
						</>
					) : (
						<>
							<Send size={14} aria-hidden="true" />
							{t("send")}
						</>
					)}
				</button>
			</div>
		</form>
	);
}
