// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Agus Darmawan — Full-Stack & Robotics Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
	return new ImageResponse(
		<div
			style={{
				width: "1200px",
				height: "630px",
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
					inset: "0",
					display: "flex",
					background:
						"radial-gradient(ellipse at 20% 50%, rgba(119,33,111,0.35) 0%, transparent 60%)",
				}}
			/>

			{/* Orange accent gradient */}
			<div
				style={{
					position: "absolute",
					inset: "0",
					display: "flex",
					background:
						"radial-gradient(ellipse at 80% 20%, rgba(233,84,32,0.15) 0%, transparent 50%)",
				}}
			/>

			{/* Top bar simulation */}
			<div
				style={{
					position: "absolute",
					top: "0",
					left: "0",
					right: "0",
					height: "36px",
					background: "rgba(18,8,16,0.95)",
					display: "flex",
					alignItems: "center",
					padding: "0 24px",
					justifyContent: "space-between",
				}}
			>
				<span
					style={{
						color: "rgba(255,255,255,0.6)",
						fontSize: "13px",
						display: "flex",
					}}
				>
					Activities
				</span>
				<span
					style={{
						color: "rgba(255,255,255,0.6)",
						fontSize: "13px",
						display: "flex",
					}}
				>
					Mon Mar 16 · 19:00
				</span>
				<span
					style={{
						color: "rgba(255,255,255,0.6)",
						fontSize: "13px",
						display: "flex",
					}}
				>
					EN
				</span>
			</div>

			{/* Main content */}
			<div
				style={{
					flex: "1",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "60px 80px",
					paddingTop: "96px",
				}}
			>
				{/* Header row — logo + label */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						marginBottom: "32px",
					}}
				>
					{/* Ubuntu circle logo */}
					<div
						style={{
							width: "48px",
							height: "48px",
							borderRadius: "50%",
							border: "3px solid #e95420",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<div
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								background: "#e95420",
								display: "flex",
							}}
						/>
					</div>

					<span
						style={{
							color: "#e95420",
							fontSize: "15px",
							letterSpacing: "0.2em",
							textTransform: "uppercase",
							display: "flex",
						}}
					>
						Ubuntu Portfolio
					</span>
				</div>

				{/* Name */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginBottom: "16px",
					}}
				>
					<span
						style={{
							fontSize: "72px",
							fontWeight: 700,
							color: "white",
							lineHeight: "1.1",
							display: "flex",
						}}
					>
						I Wayan Agus
					</span>
					<span
						style={{
							fontSize: "72px",
							fontWeight: 700,
							color: "#e95420",
							lineHeight: "1.1",
							display: "flex",
						}}
					>
						Darmawan
					</span>
				</div>

				{/* Role */}
				<div
					style={{
						fontSize: "24px",
						color: "rgba(255,255,255,0.55)",
						marginBottom: "48px",
						display: "flex",
					}}
				>
					Full-Stack &amp; Robotics Developer · Denpasar, Bali
				</div>

				{/* Tech tags */}
				<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
								borderRadius: "999px",
								background: "rgba(233,84,32,0.15)",
								border: "1px solid rgba(233,84,32,0.3)",
								color: "#e95420",
								fontSize: "14px",
								fontWeight: 500,
								display: "flex",
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
				<span
					style={{
						color: "rgba(255,255,255,0.3)",
						fontSize: "14px",
						display: "flex",
					}}
				>
					agus-darmawan.com
				</span>
				<span
					style={{
						color: "rgba(255,255,255,0.3)",
						fontSize: "14px",
						display: "flex",
					}}
				>
					github.com/agus-darmawan
				</span>
			</div>
		</div>,
		{ ...size },
	);
}
