"use client";

import { Music } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatMs } from "@/lib/utils";
import type { SpotifyTrack } from "@/types/spotify";

interface SpotifyPanelProps {
	track: SpotifyTrack;
}

/**
 * SpotifyPanel — expanded card with album art, track details, and
 * a scrubber-style progress bar.
 */
export function SpotifyPanel({ track }: SpotifyPanelProps) {
	const t = useTranslations("TopBar");
	const progressPct = Math.min((track.progress / track.duration) * 100, 100);

	return (
		<div className="px-4 py-3">
			<div className="flex items-center gap-2 mb-3">
				<Music className="w-4 h-4 text-green-400 shrink-0" />
				<span
					className="text-xs font-medium"
					style={{ color: "var(--panel-text-muted)" }}
				>
					{t("nowPlaying")}
				</span>
			</div>

			<div className="flex items-start gap-3 mb-3">
				{track.albumArt ? (
					<Image
						src={track.albumArt}
						alt={`${track.album} album cover`}
						width={56}
						height={56}
						className="rounded-lg shadow-lg shrink-0 object-cover"
						unoptimized
					/>
				) : (
					<div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
						<Music className="w-6 h-6 opacity-40" />
					</div>
				)}

				<div className="flex-1 min-w-0">
					<p
						className="text-sm font-semibold truncate"
						style={{ color: "var(--panel-text)" }}
					>
						{track.name}
					</p>
					<p
						className="text-xs truncate mt-0.5"
						style={{ color: "var(--panel-text-muted)" }}
					>
						{track.artist}
					</p>
					<p
						className="text-xs truncate"
						style={{ color: "var(--panel-text-muted)", opacity: 0.6 }}
					>
						{track.album}
					</p>
				</div>
			</div>

			{/* Progress bar */}
			<div>
				<div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
					<div
						className="bg-green-400 h-1 rounded-full transition-all duration-500"
						style={{ width: `${progressPct}%` }}
					/>
				</div>
				<div
					className="flex justify-between text-[10px] mt-1 tabular-nums"
					style={{ color: "var(--panel-text-muted)" }}
				>
					<span>{formatMs(track.progress)}</span>
					<span>{formatMs(track.duration)}</span>
				</div>
			</div>
		</div>
	);
}
