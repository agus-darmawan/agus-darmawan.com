"use client";

import { Play } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";

interface YoutubeBlockProps {
	videoId: string;
	title?: string;
	accentColor: string;
}

export function YoutubeBlock({
	videoId,
	title,
	accentColor,
}: YoutubeBlockProps) {
	const [active, setActive] = useState(false);
	const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

	return (
		<figure className="my-4">
			<div
				className="relative rounded-xl overflow-hidden cursor-pointer"
				style={{
					border: `1px solid ${accentColor}30`,
					aspectRatio: "16/9",
				}}
				onClick={() => setActive(true)}
			>
				{active ? (
					<iframe
						src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
						title={title ?? "YouTube video"}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute inset-0 w-full h-full border-0"
					/>
				) : (
					<>
						<NextImage
							src={thumb}
							alt={title ?? "YouTube thumbnail"}
							fill
							className="object-cover"
							unoptimized
						/>
						{/* Dark overlay */}
						<div className="absolute inset-0 bg-black/30" />
						{/* Play button */}
						<div className="absolute inset-0 flex items-center justify-center">
							<div
								className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
								style={{ background: accentColor }}
							>
								<Play size={22} className="text-white ml-1" fill="white" />
							</div>
						</div>
					</>
				)}
			</div>
			{title && (
				<figcaption
					className="text-center text-[11px] mt-1.5"
					style={{ color: "var(--text-muted)" }}
				>
					{title}
				</figcaption>
			)}
		</figure>
	);
}
