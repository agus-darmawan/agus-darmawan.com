"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactInputField, ContactTextareaField } from "./ContactFormField";
import { useContactForm } from "./hooks/useContactForm";

export function ContactForm() {
	const t = useTranslations("ContactWindow");
	const {
		name,
		email,
		message,
		status,
		errorMsg,
		canSubmit,
		setName,
		setEmail,
		setMessage,
		submit,
	} = useContactForm();

	return (
		<div className="px-6 py-5">
			{/* Section title */}
			<div className="flex items-center gap-2 mb-4">
				<div
					className="h-px flex-1"
					style={{ background: "var(--border)" }}
					aria-hidden
				/>
				<p
					className="text-[10px] font-semibold uppercase tracking-widest shrink-0"
					style={{ color: "var(--text-muted)" }}
				>
					{t("sendMessage")}
				</p>
				<div
					className="h-px flex-1"
					style={{ background: "var(--border)" }}
					aria-hidden
				/>
			</div>

			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-3">
					<ContactInputField
						id="contact-name"
						label={t("namePlaceholder") ? undefined : "Name"}
						placeholder={t("namePlaceholder")}
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={status === "sending"}
						autoComplete="name"
					/>
					<ContactInputField
						id="contact-email"
						label={t("emailPlaceholder") ? undefined : "Email"}
						placeholder={t("emailPlaceholder")}
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={status === "sending"}
						autoComplete="email"
					/>
				</div>

				<ContactTextareaField
					id="contact-message"
					placeholder={t("messagePlaceholder")}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					rows={4}
					disabled={status === "sending"}
				/>

				{/* Status feedback */}
				{status === "error" && errorMsg && (
					<div
						className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
						style={{
							background: "#c7162b18",
							border: "1px solid #c7162b30",
							color: "#c7162b",
						}}
					>
						<AlertCircle size={13} className="shrink-0" />
						<span>{errorMsg}</span>
					</div>
				)}

				{status === "sent" && (
					<div
						className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
						style={{
							background: "#10b98118",
							border: "1px solid #10b98130",
							color: "#10b981",
						}}
					>
						<CheckCircle2 size={13} className="shrink-0" />
						<span>{t("sent")}</span>
					</div>
				)}

				<button
					type="button"
					onClick={submit}
					disabled={!canSubmit || status === "sending"}
					className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					style={{
						background:
							status === "sent"
								? "#10b981"
								: status === "error"
									? "#c7162b"
									: "#e95420",
					}}
				>
					{status === "sending" ? (
						<>
							<Loader2 size={14} className="animate-spin" />
							Sending…
						</>
					) : status === "sent" ? (
						<>
							<CheckCircle2 size={14} />
							{t("sent")}
						</>
					) : (
						<>
							<Send size={14} />
							{t("send")}
						</>
					)}
				</button>
			</div>
		</div>
	);
}
