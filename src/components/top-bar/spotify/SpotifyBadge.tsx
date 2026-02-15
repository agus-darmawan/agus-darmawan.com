import { Music } from "lucide-react";
import { SpotifyTrack } from "@/types/spotify";
import { RefreshIndicator } from "../RefreshIndicator";

/**
 * SpotifyNowPlayingBadge — compact top-bar pill showing current track
 * with auto-refresh indicator.
 */
interface SpotifyBadgeProps {
	track: SpotifyTrack;
	refreshProgress: number;
}

export function SpotifyBadge({ track, refreshProgress }: SpotifyBadgeProps) {
	return (
		<div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/10 transition-colors">
			<Music className="w-3.5 h-3.5 text-green-400 shrink-0" />
			<span className="text-xs max-w-30 truncate leading-none">
				{track.name}
			</span>
			<RefreshIndicator progress={refreshProgress} className="text-green-400" />
		</div>
	);
}
