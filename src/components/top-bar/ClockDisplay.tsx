"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

/**
 * ClockDisplay — shows current date and time, updated every second.
 * Formats date and time according to user's locale (en-US or id-ID).
 */
export function ClockDisplay() {
	const locale = useLocale();
	const bcp = locale === "id" ? "id-ID" : "en-US";

	const [time, setTime] = useState<Date | null>(null);

	useEffect(() => {
		setTime(new Date());

		const id = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(id);
	}, []);

	if (!time) return null; // fix hydration mismatch

	const date = time.toLocaleDateString(bcp, {
		weekday: "short",
		month: "short",
		day: "numeric",
	});

	const clock = time.toLocaleTimeString(bcp, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	return (
		<time
			dateTime={time.toISOString()}
			className="text-sm font-medium tabular-nums"
		>
			{date} {clock}
		</time>
	);
}
