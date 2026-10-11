import { Music } from "lucide-react";
import type { SpotifyTrack } from "@/types/spotify";
import { SPOTIFY_INTERVAL } from "../hooks/useSpotify";
import { RefreshIndicator } from "../RefreshIndicator";

/** Compact top-bar pill with the current track and a refresh arc. */
export function SpotifyBadge({
	track,
	updatedAt,
}: {
	track: SpotifyTrack;
	updatedAt: number;
}) {
	return (
		<div
			className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-default hover:bg-(--topbar-hover)"
			title={`${track.name} — ${track.artist}`}
		>
			<Music className="w-3.5 h-3.5 text-green-400 shrink-0" aria-hidden />
			<span className="text-xs max-w-30 truncate leading-none">
				{track.name}
			</span>
			<RefreshIndicator
				updatedAt={updatedAt}
				interval={SPOTIFY_INTERVAL}
				className="text-green-400"
			/>
		</div>
	);
}
