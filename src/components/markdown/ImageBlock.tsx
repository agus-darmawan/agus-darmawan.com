"use client";

import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ImageBlockProps {
	src: string;
	alt: string;
	title?: string;
}

export function ImageBlock({ src, alt, title }: ImageBlockProps) {
	const t = useTranslations("Content");
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);

	if (error) {
		return (
			<div
				role="img"
				aria-label={alt}
				className="rounded-xl flex items-center justify-center text-xs py-6 my-3 bg-(--surface-secondary) border border-(--border) text-(--text-muted)"
			>
				{t("imageFailed", { alt })}
			</div>
		);
	}

	return (
		<figure className="my-4">
			<div
				className={`relative rounded-xl overflow-hidden bg-(--surface-secondary) border border-(--border) ${loaded ? "" : "min-h-30"}`}
			>
				{!loaded && (
					<div
						aria-hidden
						className="absolute inset-0 flex items-center justify-center"
					>
						<div className="w-5 h-5 rounded-full border-2 border-(--border) border-t-transparent animate-spin" />
					</div>
				)}
				<NextImage
					src={src}
					alt={alt}
					width={800}
					height={450}
					className={`w-full h-auto object-contain transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
					onLoad={() => setLoaded(true)}
					onError={() => setError(true)}
					unoptimized
				/>
			</div>
			{(title || alt) && (
				<figcaption className="text-center text-[11px] mt-1.5 text-(--text-muted)">
					{title || alt}
				</figcaption>
			)}
		</figure>
	);
}
