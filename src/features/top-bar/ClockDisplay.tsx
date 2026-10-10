"use client";

import { useFormatter, useNow } from "next-intl";
import { useEffect, useState } from "react";

/** Live clock in the visitor's own time zone, formatted per locale. */
export function ClockDisplay() {
	const format = useFormatter();
	const now = useNow({ updateInterval: 1_000 });
	// Client-only: the server's clock and zone would never match the visitor's.
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return (
		<time
			dateTime={now.toISOString()}
			className="text-sm font-medium tabular-nums select-none text-(--topbar-text)"
		>
			{format.dateTime(now, {
				weekday: "short",
				month: "short",
				day: "numeric",
				timeZone,
			})}
			&ensp;
			{format.dateTime(now, {
				hour: "2-digit",
				minute: "2-digit",
				hourCycle: "h23",
				timeZone,
			})}
		</time>
	);
}
