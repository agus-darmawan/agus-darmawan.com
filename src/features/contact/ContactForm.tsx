"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT_LIMITS } from "@/lib/contact/schema";
import { cn } from "@/lib/utils";
import { ContactInputField, ContactTextareaField } from "./ContactFormField";
import { useContactForm } from "./hooks/useContactForm";

/** Roomier fields for the contact page, with outlines that pass 3:1. */
const FIELD_PAGE =
	"px-3.5 py-2.5 text-[0.9375rem] rounded-lg bg-(--surface) border-(--site-field)";

/**
 * Status colours. The desktop keeps its own; on the website every text and
 * button colour passes WCAG AA in both themes.
 */
const TONES = {
	window: {
		error: "text-[#c7162b]",
		sent: "text-[#10b981]",
		idle: "bg-[#e95420] text-white",
		sentButton: "bg-[#10b981] text-white",
	},
	page: {
		error: "text-[#c7162b] dark:text-[#f87171]",
		sent: "text-[#0e8420] dark:text-[#34d399]",
		idle: "bg-(--site-primary) text-(--site-on-primary)",
		sentButton: "bg-[#0e8420] text-white",
	},
} as const;

interface ContactFormProps {
	/**
	 * window — compact form inside the desktop app (heading, hidden labels)
	 * page   — the contact page: visible labels, roomier fields, no heading
	 */
	variant?: "window" | "page";
}

export function ContactForm({ variant = "window" }: ContactFormProps) {
	const t = useTranslations("ContactWindow");
	const page = variant === "page";
	const tone = TONES[variant];
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
			className={page ? undefined : "px-6 py-5"}
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				void submit();
			}}
		>
			{!page && (
				<div className="flex items-center gap-2 mb-4">
					<div className="h-px flex-1 bg-(--border)" aria-hidden="true" />
					<h2 className="text-[10px] font-semibold uppercase tracking-widest shrink-0 text-(--text-muted)">
						{t("sendMessage")}
					</h2>
					<div className="h-px flex-1 bg-(--border)" aria-hidden="true" />
				</div>
			)}

			<div className={page ? "space-y-5" : "space-y-3"}>
				<div
					className={cn(
						"grid grid-cols-1 sm:grid-cols-2",
						page ? "gap-5" : "gap-3",
					)}
				>
					<ContactInputField
						id="contact-name"
						label={t("nameLabel")}
						labelVisible={page}
						className={page ? FIELD_PAGE : undefined}
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
						labelVisible={page}
						className={page ? FIELD_PAGE : undefined}
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
					labelVisible={page}
					className={page ? FIELD_PAGE : undefined}
					placeholder={t("messagePlaceholder")}
					value={fields.message}
					onChange={(e) => setField("message")(e.target.value)}
					rows={page ? 7 : 4}
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
						<p
							className={cn(
								"flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-[#c7162b]/10 border border-[#c7162b]/20",
								tone.error,
							)}
						>
							<AlertCircle size={13} className="shrink-0" aria-hidden="true" />
							{t(`errors.${failure}`)}
						</p>
					)}
					{status === "sent" && (
						<p
							className={cn(
								"flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-[#10b981]/10 border border-[#10b981]/20",
								tone.sent,
							)}
						>
							<CheckCircle2 size={13} className="shrink-0" aria-hidden="true" />
							{t("sent")}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={!canSubmit}
					className={cn(
						"w-full flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
						page ? "h-10 rounded-lg text-sm" : "py-2.5 rounded-xl text-sm",
						status === "sent"
							? tone.sentButton
							: status === "error"
								? "bg-[#c7162b] text-white"
								: tone.idle,
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
