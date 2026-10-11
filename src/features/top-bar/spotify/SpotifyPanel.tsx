"use client";

import { Music } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatMs } from "@/lib/utils";
import type { SpotifyTrack } from "@/types/spotify";

/** Expanded now-playing card inside the system menu. */
export function SpotifyPanel({ track }: { track: SpotifyTrack }) {
	const t = useTranslations("TopBar");
	const progress = track.duration
		? Math.min((track.progress / track.duration) * 100, 100)
		: 0;

	return (
		<div className="px-4 py-3">
			<p className="flex items-center gap-2 mb-3 text-xs font-medium text-(--panel-text-muted)">
				<Music className="w-4 h-4 text-green-400 shrink-0" aria-hidden />
				{t("nowPlaying")}
			</p>

			<div className="flex items-start gap-3 mb-3">
				{track.albumArt ? (
					<Image
						src={track.albumArt}
						alt={t("albumCover", { album: track.album })}
						width={56}
						height={56}
						className="rounded-lg shadow-lg shrink-0 object-cover"
						unoptimized
					/>
				) : (
					<div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
						<Music className="w-6 h-6 opacity-40" aria-hidden />
					</div>
				)}

				<div className="flex-1 min-w-0">
					<p className="text-sm font-semibold truncate text-(--panel-text)">
						{track.name}
					</p>
					<p className="text-xs truncate mt-0.5 text-(--panel-text-muted)">
						{track.artist}
					</p>
					<p className="text-xs truncate text-(--panel-text-muted) opacity-60">
						{track.album}
					</p>
				</div>
			</div>

			<div
				role="progressbar"
				aria-label={t("nowPlaying")}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(progress)}
				className="w-full bg-white/10 rounded-full h-1 overflow-hidden"
			>
				<div
					className="bg-green-400 h-1 rounded-full transition-[width] duration-500"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="flex justify-between text-[10px] mt-1 tabular-nums text-(--panel-text-muted)">
				<span>{formatMs(track.progress)}</span>
				<span>{formatMs(track.duration)}</span>
			</div>
		</div>
	);
}
