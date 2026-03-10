"use client";

import { useTranslations } from "next-intl";

const EXPERIENCES = [
	{
		title: "Frontend Developer",
		company: "TechCorp Indonesia",
		period: { start: "Jan 2023", end: null },
		location: "Denpasar, Bali",
		color: "#e95420",
		logo: "🏢",
		responsibilities: [
			"Led migration of legacy jQuery codebase to Next.js 14, reducing initial load time by 60% and improving Core Web Vitals scores",
			"Designed and built a reusable component library with Storybook documentation, adopted across 3 product teams",
			"Collaborated with designers to implement pixel-perfect UIs with full accessibility compliance (WCAG 2.1 AA)",
			"Mentored 2 junior developers and conducted weekly code reviews to maintain code quality",
			"Introduced unit and integration testing with Jest and React Testing Library, raising coverage from 5% to 72%",
		],
		tech: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Storybook",
			"Jest",
			"PostgreSQL",
		],
	},
	{
		title: "Web Developer",
		company: "StartupXYZ",
		period: { start: "Jun 2022", end: "Dec 2022" },
		location: "Remote",
		color: "#3b82f6",
		logo: "🚀",
		responsibilities: [
			"Developed and maintained RESTful APIs using Express.js and PostgreSQL for a SaaS B2B platform",
			"Implemented real-time collaboration features using WebSocket and Redis pub/sub messaging",
			"Designed and optimized complex SQL queries, reducing average API response time from 800ms to 95ms",
			"Integrated third-party services including Stripe payments, Twilio SMS, and SendGrid email",
		],
		tech: [
			"Express.js",
			"PostgreSQL",
			"Redis",
			"WebSocket",
			"Stripe",
			"Docker",
		],
	},
	{
		title: "Freelance Web Developer",
		company: "Self-Employed",
		period: { start: "Jan 2021", end: "May 2022" },
		location: "Bali, Indonesia",
		color: "#10b981",
		logo: "💻",
		responsibilities: [
			"Delivered 10+ custom websites and web applications for small businesses across Bali",
			"Worked directly with clients to gather requirements, design wireframes, and iterate on feedback",
			"Built e-commerce solutions with WooCommerce and custom React storefronts integrated with local payment gateways",
		],
		tech: ["React", "WordPress", "WooCommerce", "PHP", "MySQL", "Figma"],
	},
];

export default function ExperienceWindow() {
	const t = useTranslations("ExperienceWindow");

	return (
		<div
			className="h-full overflow-auto"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* Header */}
			<div
				className="px-6 pt-6 pb-4 border-b"
				style={{ borderColor: "var(--border)" }}
			>
				<h1
					className="text-lg font-bold"
					style={{ color: "var(--text-primary)" }}
				>
					{t("title")}
				</h1>
				<p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
					{EXPERIENCES.length} positions · 3+ years
				</p>
			</div>

			{/* Timeline */}
			<div className="px-6 py-5 space-y-6">
				{EXPERIENCES.map((exp, idx) => (
					<div key={exp.company} className="relative flex gap-4">
						{/* Timeline line */}
						{idx < EXPERIENCES.length - 1 && (
							<div
								className="absolute left-5 top-12 bottom-0 w-px"
								style={{
									background: "var(--border)",
									transform: "translateX(-0.5px)",
								}}
							/>
						)}

						{/* Logo */}
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md"
							style={{ background: exp.color }}
						>
							{exp.logo}
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0 pb-2">
							<div className="flex flex-wrap items-start justify-between gap-1 mb-2">
								<div>
									<h2
										className="font-semibold text-sm"
										style={{ color: "var(--text-primary)" }}
									>
										{exp.title}
									</h2>
									<p className="text-xs" style={{ color: exp.color }}>
										{exp.company} · {exp.location}
									</p>
								</div>
								<span
									className="text-xs px-2 py-0.5 rounded-full border shrink-0"
									style={{
										color: "var(--text-muted)",
										borderColor: "var(--border)",
										background: "var(--surface-secondary)",
									}}
								>
									{exp.period.start} – {exp.period.end ?? t("present")}
								</span>
							</div>

							{/* Responsibilities */}
							<div
								className="rounded-xl p-3 mb-3 border"
								style={{
									background: "var(--surface-secondary)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-xs font-medium mb-2 uppercase tracking-wide"
									style={{ color: "var(--text-muted)" }}
								>
									{t("responsibilities")}
								</p>
								<ul className="space-y-1.5">
									{exp.responsibilities.map((r, i) => (
										<li
											key={i}
											className="flex gap-2 text-xs"
											style={{ color: "var(--text-secondary)" }}
										>
											<span
												className="mt-0.5 shrink-0"
												style={{ color: exp.color }}
											>
												▸
											</span>
											<span>{r}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Tech stack */}
							<div>
								<p
									className="text-xs font-medium mb-1.5 uppercase tracking-wide"
									style={{ color: "var(--text-muted)" }}
								>
									{t("techStack")}
								</p>
								<div className="flex flex-wrap gap-1.5">
									{exp.tech.map((tech) => (
										<span
											key={tech}
											className="text-xs px-2 py-0.5 rounded-full font-medium"
											style={{
												background: `${exp.color}18`,
												color: exp.color,
												border: `1px solid ${exp.color}30`,
											}}
										>
											{tech}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
