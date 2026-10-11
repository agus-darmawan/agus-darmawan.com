"use client";

import { ActivityStatus } from "./ActivityStatus";
import { ClockDisplay } from "./ClockDisplay";
import { useSpotify } from "./hooks/useSpotify";
import { SystemStatus } from "./SystemStatus";
import { SettingsMenu } from "./setting/SettingsMenu";
import { SpotifyBadge } from "./spotify/SpotifyBadge";

/** GNOME-style top bar — always dark, like the real Ubuntu panel. */
export default function TopBar() {
	const { track, updatedAt } = useSpotify();

	return (
		<header
			data-tour="topbar"
			className="fixed top-0 inset-x-0 h-8 flex items-center justify-between px-2 z-50 border-b bg-(--topbar-bg) border-(--topbar-border) text-(--topbar-text) backdrop-blur-md"
		>
			<ActivityStatus />

			<div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
				<ClockDisplay />
			</div>

			<div className="flex items-center gap-0.5">
				{track && <SpotifyBadge track={track} updatedAt={updatedAt} />}
				<SystemStatus />
				<SettingsMenu />
			</div>
		</header>
	);
}
