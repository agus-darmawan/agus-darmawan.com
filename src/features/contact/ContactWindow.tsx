"use client";

import { Mail, MessageSquare } from "lucide-react";
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
				className="relative overflow-hidden border-b"
				style={{ borderColor: "var(--border)" }}
			>
				{/* Top accent — purple gradient (beda dari orange projects/blog) */}
				<div
					className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
					style={{
						background:
							"linear-gradient(90deg, #8b5cf6 0%, #6366f150 50%, transparent 100%)",
					}}
				/>

				{/* Waveform decoration — kanan, SVG path */}
				<svg
					className="absolute right-0 top-0 h-full pointer-events-none"
					width="130"
					viewBox="0 0 130 120"
					preserveAspectRatio="xMaxYMid meet"
					aria-hidden="true"
					style={{ opacity: 0.45 }}
				>
					{[0, 12, 24, 36, 48, 60, 72, 84, 96, 108].map((y, i) => (
						<line
							key={y}
							x1={130 - (i % 2 === 0 ? 20 : 40)}
							y1={y}
							x2={130}
							y2={y}
							stroke="var(--border)"
							strokeWidth="1"
						/>
					))}
					<path
						d="M130,0 Q110,30 130,60 Q110,90 130,120"
						fill="none"
						stroke="var(--border)"
						strokeWidth="1"
					/>
					<path
						d="M130,0 Q95,30 130,60 Q95,90 130,120"
						fill="none"
						stroke="var(--border)"
						strokeWidth="0.6"
						opacity="0.6"
					/>
				</svg>

				{/* Bottom accent */}
				<div
					className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
					style={{
						background:
							"linear-gradient(90deg, rgba(139,92,246,0.35), transparent 60%)",
					}}
				/>

				{/* Content */}
				<div className="relative px-6 pt-5 pb-5" style={{ zIndex: 1 }}>
					<div className="flex items-start gap-3 mb-3">
						{/* Icon — purple */}
						<div className="relative shrink-0">
							<div
								className="absolute inset-0 rounded-xl blur-sm pointer-events-none"
								style={{ background: "rgba(139,92,246,0.35)" }}
							/>
							<div
								className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
								style={{ background: "#8b5cf6" }}
							>
								<MessageSquare size={15} className="text-white" />
							</div>
						</div>

						<div>
							<h1
								className="text-base font-bold leading-tight"
								style={{ color: "var(--text-primary)" }}
							>
								{t("title")}
							</h1>
							<p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
								{t("subtitle")}
							</p>
						</div>
					</div>

					{/* Desc */}
					<p
						className="text-xs leading-relaxed mb-4"
						style={{ color: "var(--text-secondary)" }}
					>
						{t("headerDesc")}
					</p>

					{/* Divider */}
					<div className="flex items-center gap-2">
						<Mail size={10} style={{ color: "var(--text-muted)" }} />
						<span
							className="text-[9px] font-semibold uppercase tracking-widest"
							style={{ color: "var(--text-muted)" }}
						>
							{t("findMe")}
						</span>
						<div
							className="flex-1 h-px"
							style={{
								background:
									"linear-gradient(90deg, var(--border), transparent)",
							}}
						/>
					</div>
				</div>
			</div>

			{/* ── Social links ───────────────────────────────────── */}
			<div
				className="px-6 py-4 border-b"
				style={{ borderColor: "var(--border)" }}
			>
				<ContactSocialLinks />
			</div>

			{/* ── Form ───────────────────────────────────────────── */}
			<ContactForm />
		</div>
	);
}
