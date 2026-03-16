"use client";

import NextImage from "next/image";
import { useState } from "react";

interface ImageBlockProps {
	src: string;
	alt: string;
	title?: string;
}

export function ImageBlock({ src, alt, title }: ImageBlockProps) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);

	if (error) {
		return (
			<div
				className="rounded-xl flex items-center justify-center text-xs py-6 my-3"
				style={{
					background: "var(--surface-secondary)",
					border: "1px solid var(--border)",
					color: "var(--text-muted)",
				}}
			>
				Failed to load image: {alt}
			</div>
		);
	}

	return (
		<figure className="my-4">
			<div
				className="relative rounded-xl overflow-hidden"
				style={{
					background: "var(--surface-secondary)",
					border: "1px solid var(--border)",
					minHeight: loaded ? undefined : 120,
				}}
			>
				{!loaded && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div
							className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
							style={{
								borderColor: "var(--border)",
								borderTopColor: "transparent",
							}}
						/>
					</div>
				)}
				<NextImage
					src={src}
					alt={alt}
					width={800}
					height={450}
					className="w-full h-auto object-contain"
					style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.2s" }}
					onLoad={() => setLoaded(true)}
					onError={() => setError(true)}
					unoptimized
				/>
			</div>
			{(title || alt) && (
				<figcaption
					className="text-center text-[11px] mt-1.5"
					style={{ color: "var(--text-muted)" }}
				>
					{title || alt}
				</figcaption>
			)}
		</figure>
	);
}
