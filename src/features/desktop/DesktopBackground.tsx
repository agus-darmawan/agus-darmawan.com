/** Decorative wallpaper behind the windows: gradient, glows, dot grid. */
export function DesktopBackground() {
	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 overflow-hidden pointer-events-none"
		>
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,#3d1145_0%,#1a0828_45%,#0d0010_100%)]" />
			<div className="absolute -top-20 -right-15 size-125 rounded-full bg-[radial-gradient(circle,rgba(233,84,32,0.07)_0%,transparent_65%)]" />
			<div className="absolute -bottom-25 -left-20 size-150 rounded-full bg-[radial-gradient(circle,rgba(119,33,111,0.12)_0%,transparent_65%)]" />

			<svg
				aria-hidden="true"
				className="absolute inset-0 w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern
						id="desktop-dots"
						width="28"
						height="28"
						patternUnits="userSpaceOnUse"
					>
						<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.045)" />
					</pattern>
					<pattern
						id="desktop-diag"
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
					<radialGradient id="desktop-fade" cx="50%" cy="50%" r="55%">
						<stop offset="0%" stopColor="white" stopOpacity="1" />
						<stop offset="100%" stopColor="white" stopOpacity="0" />
					</radialGradient>
					<mask id="desktop-vignette">
						<rect width="100%" height="100%" fill="url(#desktop-fade)" />
					</mask>
				</defs>
				<rect
					width="100%"
					height="100%"
					fill="url(#desktop-dots)"
					mask="url(#desktop-vignette)"
				/>
				<rect width="100%" height="100%" fill="url(#desktop-diag)" />
			</svg>
		</div>
	);
}
