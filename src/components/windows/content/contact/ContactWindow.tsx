"use client";

import {
	Github,
	Linkedin,
	Mail,
	MapPin,
	MessageSquare,
	Send,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const SOCIAL_LINKS = [
	{
		icon: Github,
		label: "GitHub",
		href: "https://github.com/agus-darmawan",
		value: "@agus-darmawan",
		color: "#6366f1",
	},
	{
		icon: Linkedin,
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/agusdarmawnn/",
		value: "Agus Darmawan",
		color: "#0ea5e9",
	},
	{
		icon: Mail,
		label: "Email",
		href: "mailto:darmawandeveloper@gmail.com",
		value: "darmawandeveloper@gmail.com",
		color: "#e95420",
	},
	{
		icon: MapPin,
		label: "Location",
		href: null,
		value: "Denpasar, Bali, Indonesia",
		color: "#10b981",
	},
] as const;

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactWindow() {
	const t = useTranslations("ContactWindow");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<FormStatus>("idle");

	const handleSubmit = async () => {
		if (!name || !email || !message) return;
		setStatus("sending");
		// Simulate sending — in production, wire to your API route
		await new Promise((r) => setTimeout(r, 1200));
		setStatus("sent");
		setName("");
		setEmail("");
		setMessage("");
		setTimeout(() => setStatus("idle"), 4000);
	};

	const inputClass =
		"w-full px-3 py-2 rounded-xl text-sm outline-none border transition-colors";

	return (
		<div
			className="h-full overflow-auto"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* Header */}
			<div
				className="px-6 pt-6 pb-5 border-b"
				style={{
					borderColor: "var(--border)",
					background: "linear-gradient(135deg, #e9542010 0%, transparent 60%)",
				}}
			>
				<div className="flex items-center gap-3 mb-1">
					<div className="w-8 h-8 rounded-xl bg-ubuntu-orange flex items-center justify-center">
						<MessageSquare size={16} className="text-white" />
					</div>
					<h1 className="text-lg font-bold text-(--text-primary)">
						{t("title")}
					</h1>
				</div>
				<p className="text-xs text-(--text-muted) ml-11">
					{t("subtitle") ?? "Let's build something together"}
				</p>
			</div>

			{/* Social links */}
			<div className="px-6 py-5 border-b border-(--border)">
				<div className="grid grid-cols-2 gap-2">
					{SOCIAL_LINKS.map(({ icon: Icon, label, href, value, color }) => {
						const content = (
							<>
								<div
									className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
									style={{ background: `${color}18` }}
								>
									<Icon size={14} style={{ color }} />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-medium uppercase tracking-wide text-(--text-muted)">
										{label}
									</p>
									<p className="text-xs truncate font-medium text-(--text-secondary)">
										{value}
									</p>
								</div>
							</>
						);

						if (!href) {
							return (
								<div
									key={label}
									className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-(--surface-secondary) border-(--border)"
								>
									{content}
								</div>
							);
						}

						return (
							<a
								key={label}
								href={href}
								target={href.startsWith("mailto") ? undefined : "_blank"}
								rel="noreferrer"
								className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-(--surface-secondary) border-(--border) transition-all hover:scale-[1.02]"
								style={{ "--c": color } as React.CSSProperties}
								onMouseEnter={(e) => {
									(e.currentTarget as HTMLElement).style.borderColor =
										`${color}50`;
									(e.currentTarget as HTMLElement).style.background =
										`${color}08`;
								}}
								onMouseLeave={(e) => {
									(e.currentTarget as HTMLElement).style.borderColor =
										"var(--border)";
									(e.currentTarget as HTMLElement).style.background =
										"var(--surface-secondary)";
								}}
							>
								{content}
							</a>
						);
					})}
				</div>
			</div>

			{/* Contact form */}
			<div className="px-6 py-5">
				<p className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
					{t("sendMessage") ?? "Send a Message"}
				</p>

				<div className="space-y-3">
					<input
						type="text"
						placeholder={t("namePlaceholder") ?? "Your name"}
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={inputClass}
						style={{
							background: "var(--surface-secondary)",
							border: "1px solid var(--border)",
							color: "var(--text-primary)",
						}}
						onFocus={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor = "#e9542050";
						}}
						onBlur={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								"var(--border)";
						}}
					/>

					<input
						type="email"
						placeholder={t("emailPlaceholder") ?? "your@email.com"}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={inputClass}
						style={{
							background: "var(--surface-secondary)",
							border: "1px solid var(--border)",
							color: "var(--text-primary)",
						}}
						onFocus={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor = "#e9542050";
						}}
						onBlur={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								"var(--border)";
						}}
					/>

					<textarea
						placeholder={
							t("messagePlaceholder") ?? "Tell me about your project or idea…"
						}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						rows={4}
						className={`${inputClass} resize-none`}
						style={{
							background: "var(--surface-secondary)",
							border: "1px solid var(--border)",
							color: "var(--text-primary)",
						}}
						onFocus={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor = "#e9542050";
						}}
						onBlur={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								"var(--border)";
						}}
					/>

					<button
						type="button"
						onClick={handleSubmit}
						disabled={
							status === "sending" ||
							status === "sent" ||
							!name ||
							!email ||
							!message
						}
						className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						style={{
							background: status === "sent" ? "#10b981" : "#e95420",
						}}
					>
						{status === "sending" ? (
							<>
								<div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
								Sending…
							</>
						) : status === "sent" ? (
							<>✓ {t("sent") ?? "Message sent!"}</>
						) : (
							<>
								<Send size={14} />
								{t("send") ?? "Send Message"}
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
