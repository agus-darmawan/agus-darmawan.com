"use client";

import { useSpotify } from "@/hooks/top-bar/useSpotify";
import { ActivityStatus } from "./ActivityStatus";
import { ClockDisplay } from "./ClockDisplay";
import { SystemStatus } from "./SystemStatus";
import { SettingsMenu } from "./setting/SettingsMenu";
import { SpotifyBadge } from "./spotify/SpotifyBadge";

/**
 * TopBar — GNOME-style top navigation bar.
 * Includes ActivityStatus, ClockDisplay, SystemStatus, and SpotifyBadge (if a track is playing).
 */
export default function TopBar() {
	const { track, refreshProgress } = useSpotify();

	return (
		<header className="fixed top-0 left-0 right-0 h-8 bg-black/90 backdrop-blur-md text-white flex items-center justify-between px-4 z-50 border-b border-white/10">
			<ActivityStatus />

			<div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
				<ClockDisplay />
			</div>

			<div className="flex items-center gap-0.5">
				{track && (
					<SpotifyBadge track={track} refreshProgress={refreshProgress} />
				)}
				<SystemStatus />
				<SettingsMenu />
			</div>
		</header>
	);
}
