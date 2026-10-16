import { useId } from "react";
import { cn } from "@/lib/utils";
import { type Point, trajectory } from "./trajectory";

const CONE_RADIUS = 120;
const CONE_ANGLE = (100 * Math.PI) / 180;

/** The robot's sensor cone: a wedge ahead of it. */
function cone({ x, y }: Point, heading: number) {
	const a = heading - CONE_ANGLE / 2;
	const b = heading + CONE_ANGLE / 2;
	const r = CONE_RADIUS;
	const at = (angle: number) =>
		`${(x + r * Math.cos(angle)).toFixed(1)} ${(y + r * Math.sin(angle)).toFixed(1)}`;
	return `M${x.toFixed(1)} ${y.toFixed(1)}L${at(a)}A${r} ${r} 0 0 1 ${at(b)}Z`;
}

const ink = { stroke: "currentColor" } as const;
const accent = { stroke: "var(--accent)" } as const;
const paper = "var(--surface-secondary)";

/**
 * The generated banner (see `trajectory`). Decorative: the page title says
 * what the item is. Colours follow the theme through CSS variables, and the
 * art is drawn for the box's aspect ratio, cropping only if the box differs.
 */
export function TrajectoryArt({
	seed,
	aspect,
	className,
}: {
	seed: string;
	/** Width / height of the box it fills. */
	aspect: number;
	className?: string;
}) {
	// Gradients and patterns are referenced by id: keep them unique even
	// across separately rendered trees, and free of characters that are
	// awkward inside url(#…).
	const uid = `banner-${seed}-${useId()}`.replace(/[^\w-]/g, "");
	const t = trajectory(seed, aspect);
	const { robot } = t;
	const major = t.cell * 5;

	return (
		<svg
			viewBox={`0 0 ${t.width} ${t.height}`}
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
			focusable="false"
			className={cn("block size-full text-(--text-primary)", className)}
		>
			<defs>
				<pattern
					id={`${uid}-grid`}
					width={t.cell}
					height={t.cell}
					patternUnits="userSpaceOnUse"
				>
					<path
						d={`M${t.cell} 0H0V${t.cell}`}
						fill="none"
						style={ink}
						strokeOpacity={0.07}
					/>
				</pattern>
				<pattern
					id={`${uid}-major`}
					width={major}
					height={major}
					patternUnits="userSpaceOnUse"
				>
					<path
						d={`M${major} 0H0V${major}`}
						fill="none"
						style={ink}
						strokeOpacity={0.1}
						strokeWidth={1.5}
					/>
				</pattern>
				<radialGradient
					id={`${uid}-glow`}
					cx={robot.x}
					cy={robot.y}
					r={t.height * 0.9}
					gradientUnits="userSpaceOnUse"
				>
					<stop
						offset="0"
						style={{ stopColor: "var(--accent)" }}
						stopOpacity={0.2}
					/>
					<stop
						offset="1"
						style={{ stopColor: "var(--accent)" }}
						stopOpacity={0}
					/>
				</radialGradient>
				<radialGradient
					id={`${uid}-cone`}
					cx={robot.x}
					cy={robot.y}
					r={CONE_RADIUS}
					gradientUnits="userSpaceOnUse"
				>
					<stop
						offset="0"
						style={{ stopColor: "var(--accent)" }}
						stopOpacity={0.4}
					/>
					<stop
						offset="1"
						style={{ stopColor: "var(--accent)" }}
						stopOpacity={0}
					/>
				</radialGradient>
			</defs>

			<rect width={t.width} height={t.height} style={{ fill: paper }} />
			<rect
				width={t.width}
				height={t.height}
				style={{ fill: "var(--accent)" }}
				className="opacity-[0.06] dark:opacity-[0.1]"
			/>
			<rect width={t.width} height={t.height} fill={`url(#${uid}-glow)`} />
			<rect width={t.width} height={t.height} fill={`url(#${uid}-grid)`} />
			<rect width={t.width} height={t.height} fill={`url(#${uid}-major)`} />

			{/* The taught route, then what the robot drove along it. */}
			<path
				d={t.taught}
				fill="none"
				style={ink}
				strokeOpacity={0.4}
				strokeWidth={3}
				strokeLinecap="round"
				strokeDasharray="0.5 11"
			/>
			<path
				d={t.driven}
				fill="none"
				style={accent}
				strokeWidth={4}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{t.stops.map((stop) => (
				<rect
					key={`${stop.x}-${stop.y}`}
					x={stop.x - 7}
					y={stop.y - 7}
					width={14}
					height={14}
					rx={2.5}
					transform={`rotate(45 ${stop.x} ${stop.y})`}
					style={
						stop.passed
							? { fill: "var(--accent)" }
							: { fill: paper, stroke: "currentColor" }
					}
					strokeOpacity={0.45}
					strokeWidth={2.5}
				/>
			))}

			{t.goal && (
				<>
					<circle
						cx={t.goal.x}
						cy={t.goal.y}
						r={13}
						fill="none"
						style={ink}
						strokeOpacity={0.4}
						strokeWidth={2.5}
					/>
					<circle
						cx={t.goal.x}
						cy={t.goal.y}
						r={4}
						style={{ fill: "currentColor" }}
						fillOpacity={0.4}
					/>
				</>
			)}
			<circle
				cx={t.start.x}
				cy={t.start.y}
				r={8}
				style={{ fill: paper, stroke: "var(--accent)" }}
				strokeWidth={3.5}
			/>

			<path d={cone(robot, robot.heading)} fill={`url(#${uid}-cone)`} />
			<g
				transform={`translate(${robot.x.toFixed(1)} ${robot.y.toFixed(1)}) rotate(${((robot.heading * 180) / Math.PI).toFixed(1)})`}
			>
				<rect
					x={-15}
					y={-11}
					width={30}
					height={22}
					rx={6}
					style={{ fill: "var(--accent)", stroke: paper }}
					strokeWidth={3}
				/>
				<path
					d="M1 -5L7 0L1 5"
					fill="none"
					style={{ stroke: paper }}
					strokeWidth={2.5}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}
