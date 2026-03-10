"use client";

import { Calendar, MapPin } from "lucide-react";

interface AboutHeaderProps {
	t: (key: string) => string;
}

export function AboutHeader({ t }: AboutHeaderProps) {
	return (
		<div
			className="relative px-6 pt-8 pb-6 border-b overflow-hidden"
			style={{ borderColor: "var(--border)" }}
		>
			{/* Subtle gradient bg */}
			<div
				className="absolute inset-0 opacity-30 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at top left, #e9542022 0%, transparent 60%)",
				}}
			/>

			<div className="relative flex items-start gap-5">
				{/* Avatar */}
				<div className="relative shrink-0">
					<div
						className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
						style={{
							background: "linear-gradient(135deg, #e95420 0%, #77216f 100%)",
						}}
					>
						👨‍💻
					</div>
					<span
						className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px]"
						style={{
							background: "#22c55e",
							borderColor: "var(--window-bg)",
						}}
					>
						✓
					</span>
				</div>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<h1
						className="text-xl font-bold"
						style={{ color: "var(--text-primary)" }}
					>
						{t("name")}
					</h1>
					<p
						className="text-sm font-medium mt-0.5"
						style={{ color: "#e95420" }}
					>
						{t("role")}
					</p>
					<div
						className="flex flex-wrap gap-3 mt-2 text-xs"
						style={{ color: "var(--text-muted)" }}
					>
						<span className="flex items-center gap-1">
							<MapPin size={11} />
							{t("location")}
						</span>
						<span className="flex items-center gap-1">
							<Calendar size={11} />
							{t("experience")}
						</span>
					</div>
				</div>
			</div>

			{/* Bio */}
			<p
				className="relative mt-4 text-sm leading-relaxed"
				style={{ color: "var(--text-secondary)" }}
			>
				{t("bio")}
			</p>
		</div>
	);
}
