import { Music } from "lucide-react";
import { RefreshIndicator } from "../RefreshIndicator";
import type { SpotifyTrack } from "../types/spotify.types";

interface SpotifyBadgeProps {
	track: SpotifyTrack;
	refreshProgress: number;
}

/**
 * SpotifyBadge — compact top-bar pill showing the current track name
 * with a live-refresh arc indicator.
 */
export function SpotifyBadge({ track, refreshProgress }: SpotifyBadgeProps) {
	return (
		<div
			className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-default"
			style={{ color: "var(--topbar-text)" }}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.background =
					"var(--topbar-hover)";
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.background = "transparent";
			}}
		>
			<Music className="w-3.5 h-3.5 text-green-400 shrink-0" />
			<span className="text-xs max-w-30 truncate leading-none">
				{track.name}
			</span>
			<RefreshIndicator progress={refreshProgress} className="text-green-400" />
		</div>
	);
}
