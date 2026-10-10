"use client";

import { Play } from "lucide-react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface YoutubeBlockProps {
	videoId: string;
	title?: string;
}

export function YoutubeBlock({ videoId, title }: YoutubeBlockProps) {
	const t = useTranslations("Content");
	const [active, setActive] = useState(false);
	const label = title ?? t("video");
	const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

	return (
		<figure className="my-4">
			<div className="relative rounded-xl overflow-hidden aspect-video border border-(--accent)/20">
				{active ? (
					<iframe
						src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
						title={label}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute inset-0 w-full h-full border-0"
					/>
				) : (
					<button
						type="button"
						onClick={() => setActive(true)}
						aria-label={t("playVideo", { title: label })}
						className="absolute inset-0 w-full h-full cursor-pointer"
					>
						<NextImage
							src={thumb}
							alt=""
							fill
							className="object-cover"
							unoptimized
						/>
						{/* Dark overlay + play icon (spans: <div> isn't valid inside <button>) */}
						<span aria-hidden className="absolute inset-0 bg-black/30" />
						<span
							aria-hidden
							className="absolute inset-0 flex items-center justify-center"
						>
							<span className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 bg-(--accent)">
								<Play size={22} className="text-white ml-1" fill="white" />
							</span>
						</span>
					</button>
				)}
			</div>
			{title && (
				<figcaption className="text-center text-[11px] mt-1.5 text-(--text-muted)">
					{title}
				</figcaption>
			)}
		</figure>
	);
}
