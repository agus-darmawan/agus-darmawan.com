import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function AboutHeader() {
	const t = useTranslations("AboutWindow");

	return (
		<header className="relative px-6 pt-8 pb-6 border-b border-(--border) overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#e9542022_0%,transparent_60%)] opacity-30 pointer-events-none"
			/>

			<div className="relative flex items-start gap-5">
				<div className="relative shrink-0">
					<Image
						src="/avatar.png"
						alt={t("name")}
						width={80}
						height={80}
						priority
						className="rounded-full"
					/>
					<span
						aria-hidden="true"
						className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-(--window-bg) bg-green-500 flex items-center justify-center text-[9px]"
					>
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
							<MapPin size={11} aria-hidden="true" />
							{t("location")}
						</span>
						<span className="flex items-center gap-1">
							<Calendar size={11} aria-hidden="true" />
							{t("experience")}
						</span>
					</div>
				</div>
			</div>

			<p className="relative mt-4 text-sm leading-relaxed text-(--text-secondary)">
				{t("bio")}
			</p>
		</header>
	);
}
