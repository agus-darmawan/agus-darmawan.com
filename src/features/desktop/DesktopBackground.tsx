"use client";

/**
 * DesktopBackground — decorative SVG background for the Ubuntu desktop.
 * Renders behind all windows. Purely visual, no interactivity.
 */
export function DesktopBackground() {
	return (
		<div
			className="absolute inset-0 overflow-hidden pointer-events-none"
			aria-hidden="true"
		>
			{/* ── Base gradient — dark purple → near-black ───────── */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse at 30% 40%, #3d1145 0%, #1a0828 45%, #0d0010 100%)",
				}}
			/>

			{/* ── Subtle light leak — top right corner ───────────── */}
			<div
				className="absolute"
				style={{
					top: "-80px",
					right: "-60px",
					width: "500px",
					height: "500px",
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(233,84,32,0.07) 0%, transparent 65%)",
				}}
			/>

			{/* ── Soft purple bloom — bottom left ────────────────── */}
			<div
				className="absolute"
				style={{
					bottom: "-100px",
					left: "-80px",
					width: "600px",
					height: "600px",
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(119,33,111,0.12) 0%, transparent 65%)",
				}}
			/>

			{/* ── SVG: dot grid + diagonal texture ───────────────── */}
			<svg
				className="absolute inset-0 w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					{/* Dot pattern */}
					<pattern
						id="dots"
						x="0"
						y="0"
						width="28"
						height="28"
						patternUnits="userSpaceOnUse"
					>
						<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.045)" />
					</pattern>

					{/* Diagonal line pattern */}
					<pattern
						id="diag"
						x="0"
						y="0"
						width="40"
						height="40"
						patternUnits="userSpaceOnUse"
					>
						<line
							x1="0"
							y1="40"
							x2="40"
							y2="0"
							stroke="rgba(255,255,255,0.018)"
							strokeWidth="1"
						/>
					</pattern>

					{/* Mask for soft fade */}
					<radialGradient id="fade" cx="50%" cy="50%" r="55%">
						<stop offset="0%" stopColor="white" stopOpacity="1" />
						<stop offset="100%" stopColor="white" stopOpacity="0" />
					</radialGradient>
					<mask id="vignette">
						<rect width="100%" height="100%" fill="url(#fade)" />
					</mask>
				</defs>

				{/* Dot grid */}
				<rect
					width="100%"
					height="100%"
					fill="url(#dots)"
					mask="url(#vignette)"
				/>

				{/* Diagonal texture */}
				<rect width="100%" height="100%" fill="url(#diag)" />
			</svg>
		</div>
	);
}
