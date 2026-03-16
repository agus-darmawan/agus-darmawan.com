"use client";

import { cn } from "@/lib/utils";

interface RefreshIndicatorProps {
	/** 0 = just fetched → 1 = about to fetch again */
	progress: number;
	size?: number;
	className?: string;
}

/**
 * Tiny SVG arc that fills up as the next refetch approaches.
 * Gives users a visual cue that data is live — no stale feeling.
 */
export function RefreshIndicator({
	progress,
	size = 10,
	className,
}: RefreshIndicatorProps) {
	const radius = (size - 2) / 2;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = circumference * (1 - progress);
	const isAlmostDue = progress > 0.8;

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			className={cn("-rotate-90", className)}
			aria-hidden="true"
		>
			{/* Background track */}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeOpacity={0.15}
				strokeWidth={1.5}
			/>
			{/* Progress arc */}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeOpacity={isAlmostDue ? 0.9 : 0.4}
				strokeWidth={1.5}
				strokeDasharray={circumference}
				strokeDashoffset={dashOffset}
				strokeLinecap="round"
				className="transition-all duration-100 ease-linear"
			/>
		</svg>
	);
}
