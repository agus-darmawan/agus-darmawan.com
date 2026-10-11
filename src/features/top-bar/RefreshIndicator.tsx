import { cn } from "@/lib/utils";

interface RefreshIndicatorProps {
	/** `dataUpdatedAt` of the query — restarts the arc on every refetch. */
	updatedAt: number;
	/** Polling interval in ms: how long the arc takes to fill. */
	interval: number;
	size?: number;
	className?: string;
}

/**
 * Tiny arc that fills up until the next refetch. Pure CSS animation —
 * it used to re-render its parent four times a second per indicator.
 */
export function RefreshIndicator({
	updatedAt,
	interval,
	size = 10,
	className,
}: RefreshIndicatorProps) {
	const center = size / 2;
	const radius = (size - 2) / 2;

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			className={cn("-rotate-90 shrink-0", className)}
			aria-hidden="true"
		>
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeOpacity={0.15}
				strokeWidth={1.5}
			/>
			{updatedAt > 0 && (
				<circle
					key={updatedAt}
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={1}
					className="animate-refresh-arc motion-reduce:animate-none"
					style={{ animationDuration: `${interval}ms` }}
				/>
			)}
		</svg>
	);
}
