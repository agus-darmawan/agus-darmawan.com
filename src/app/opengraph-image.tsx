// src/app/opengraph-image.tsx
// Next.js akan otomatis serve ini sebagai /opengraph-image
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/opengraph-image

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Agus Darmawan — Full-Stack & Robotics Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "#0d0010",
				position: "relative",
				overflow: "hidden",
				fontFamily: "sans-serif",
			}}
		>
			{/* Ubuntu purple gradient background */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(ellipse at 20% 50%, #77216f40 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #e9542020 0%, transparent 50%)",
				}}
			/>

			{/* Grid lines decoration */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Top bar simulation */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 36,
					background: "rgba(18,8,16,0.95)",
					display: "flex",
					alignItems: "center",
					padding: "0 24px",
					justifyContent: "space-between",
				}}
			>
				<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
					Activities
				</span>
				<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
					Mon Mar 16 · 19:00
				</span>
				<span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>▾</span>
			</div>

			{/* Main content */}
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "60px 80px",
					paddingTop: "96px",
				}}
			>
				{/* Ubuntu logo dots */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 16,
						marginBottom: 32,
					}}
				>
					<div
						style={{
							width: 48,
							height: 48,
							borderRadius: "50%",
							border: "3px solid #e95420",
							position: "relative",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<div
							style={{
								width: 10,
								height: 10,
								borderRadius: "50%",
								background: "#e95420",
							}}
						/>
					</div>
					<span
						style={{
							color: "#e95420",
							fontSize: 16,
							letterSpacing: "0.2em",
							textTransform: "uppercase",
						}}
					>
						Ubuntu Portfolio
					</span>
				</div>

				{/* Name */}
				<div
					style={{
						fontSize: 72,
						fontWeight: 700,
						color: "white",
						lineHeight: 1.1,
						marginBottom: 16,
					}}
				>
					I Wayan Agus
					<br />
					<span style={{ color: "#e95420" }}>Darmawan</span>
				</div>

				{/* Role */}
				<div
					style={{
						fontSize: 24,
						color: "rgba(255,255,255,0.6)",
						marginBottom: 48,
					}}
				>
					Full-Stack & Robotics Developer · Denpasar, Bali
				</div>

				{/* Tech tags */}
				<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
					{[
						"Next.js",
						"TypeScript",
						"ROS2",
						"Python",
						"Docker",
						"Cloudflare",
					].map((tag) => (
						<div
							key={tag}
							style={{
								padding: "6px 16px",
								borderRadius: 999,
								background: "rgba(233,84,32,0.15)",
								border: "1px solid rgba(233,84,32,0.3)",
								color: "#e95420",
								fontSize: 14,
								fontWeight: 500,
							}}
						>
							{tag}
						</div>
					))}
				</div>
			</div>

			{/* Bottom bar */}
			<div
				style={{
					padding: "20px 80px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderTop: "1px solid rgba(255,255,255,0.06)",
				}}
			>
				<span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
					agus-darmawan.com
				</span>
				<span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
					github.com/agus-darmawan
				</span>
			</div>
		</div>,
		{ ...size },
	);
}
