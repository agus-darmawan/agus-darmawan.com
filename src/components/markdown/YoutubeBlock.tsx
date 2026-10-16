"use client";

import { Play } from "lucide-react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface YoutubeBlockProps {
	videoId: string;
	title?: string;
}

/**
 * Click-to-load embed: a thumbnail and a play button until the reader asks
 * for the video, so the page never loads YouTube's player (or cookies) up
 * front.
 */
export function YoutubeBlock({ videoId, title }: YoutubeBlockProps) {
	const t = useTranslations("Content");
	const [active, setActive] = useState(false);
	const label = title ?? t("video");

	return (
		<figure className="md-video">
			<div className="md-video-frame">
				{active ? (
					<iframe
						src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
						title={label}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute inset-0 size-full border-0"
					/>
				) : (
					<button
						type="button"
						onClick={() => setActive(true)}
						aria-label={t("playVideo", { title: label })}
						className="group absolute inset-0 size-full cursor-pointer"
					>
						<NextImage
							src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
							alt=""
							fill
							sizes="(min-width: 1024px) 42rem, 100vw"
							className="object-cover"
							unoptimized
						/>
						<span aria-hidden className="absolute inset-0 bg-black/25" />
						<span
							aria-hidden
							className="absolute inset-0 grid place-items-center"
						>
							<span className="grid size-14 place-items-center rounded-full bg-black/70 text-white transition-colors group-hover:bg-[#e95420]">
								<Play className="ml-0.5 size-6" fill="currentColor" />
							</span>
						</span>
					</button>
				)}
			</div>
			{title && <figcaption>{title}</figcaption>}
		</figure>
	);
}
