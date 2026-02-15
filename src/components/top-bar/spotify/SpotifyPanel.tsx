"use client";

import { Music } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatMs } from "@/lib/utils";
import type { SpotifyTrack } from "@/types/spotify";

/**
 * SpotifyNowPlayingPanel — expanded card view with album art,
 * track details, and playback progress bar.
 */
interface SpotifyPanelProps {
	track: SpotifyTrack;
}

export function SpotifyPanel({ track }: SpotifyPanelProps) {
	const t = useTranslations("TopBar");
	const progressPct = (track.progress / track.duration) * 100;

	return (
		<div className="px-4 py-3">
			<div className="flex items-center gap-2 mb-3">
				<Music className="w-4 h-4 text-green-400" />
				<span className="text-xs font-medium text-gray-400">
					{t("nowPlaying")}
				</span>
			</div>

			<div className="flex items-start gap-3 mb-3">
				<Image
					src={track.albumArt}
					alt={`${track.album} album cover`}
					width={64}
					height={64}
					className="rounded-lg shadow-lg shrink-0"
					unoptimized
				/>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-semibold truncate">{track.name}</p>
					<p className="text-xs text-gray-400 truncate">{track.artist}</p>
					<p className="text-xs text-gray-500 truncate">{track.album}</p>
				</div>
			</div>

			<div>
				<div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
					<div
						className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
						style={{ width: `${progressPct}%` }}
					/>
				</div>
				<div className="flex justify-between text-[10px] text-gray-400 mt-1 tabular-nums">
					<span>{formatMs(track.progress)}</span>
					<span>{formatMs(track.duration)}</span>
				</div>
			</div>
		</div>
	);
}
