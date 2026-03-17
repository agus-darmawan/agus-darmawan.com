"use client";

import { Calendar, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";

interface AboutHeaderProps {
	t: (key: string) => string;
}

export function AboutHeader({ t }: AboutHeaderProps) {
	return (
		<div className="relative px-6 pt-8 pb-6 border-b border-(--border) overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#e9542022_0%,transparent_60%)] opacity-30 pointer-events-none" />

			<div className="relative flex items-start gap-5">
				<div className="relative shrink-0">
					<Image
						src="/avatar.png"
						alt="I Wayan Agus Darmawan profile photo"
						width={80}
						height={80}
						priority
					/>
					<span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-(--window-bg) bg-green-500 flex items-center justify-center text-[9px]">
						✓
					</span>
				</div>

				<div className="flex-1 min-w-0">
					<h1 className="text-xl font-bold text-(--text-primary)">
						{t("name")}
					</h1>
					<p className="text-sm font-medium mt-0.5 text-ubuntu-orange">
						{t("role")}
					</p>

					<div className="flex flex-wrap gap-3 mt-2 text-xs text-(--text-muted)">
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

			<p className="relative mt-4 text-sm leading-relaxed text-(--text-secondary)">
				{t("bio")}
			</p>

			{/* Scroll hint */}
			<div className="flex items-center justify-center mt-4 gap-1.5 text-[10px] text-(--text-muted) animate-bounce">
				<ChevronDown size={12} />
				<span>{t("scrollHint")}</span>
			</div>
		</div>
	);
}
