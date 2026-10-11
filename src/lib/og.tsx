import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";

/**
 * One OG card design for the home page, projects and posts — each shared
 * link gets its own title instead of the same generic card everywhere.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

interface OgCardInput {
	eyebrow: string;
	title: string;
	/** Optional second line in the accent color (home: last name). */
	titleAccent?: string;
	subtitle: string;
	tags?: string[];
	accent?: string;
}

const UBUNTU_ORANGE = "#e95420";

export function renderOgCard({
	eyebrow,
	title,
	titleAccent,
	subtitle,
	tags = [],
	accent = UBUNTU_ORANGE,
}: OgCardInput) {
	const titleSize = title.length > 48 ? 52 : title.length > 28 ? 62 : 72;
	const host = new URL(SITE.url).host;

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "#0d0010",
				position: "relative",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					background: `radial-gradient(ellipse at 15% 55%, ${accent}55 0%, transparent 60%)`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					background:
						"radial-gradient(ellipse at 85% 15%, rgba(119,33,111,0.35) 0%, transparent 55%)",
				}}
			/>

			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "64px 80px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 16,
						marginBottom: 28,
						color: accent,
						fontSize: 18,
						letterSpacing: "0.2em",
						textTransform: "uppercase",
					}}
				>
					{/* No emoji here: Satori fetches emoji glyphs from a CDN at render
					    time, so one network hiccup would 500 the whole card. */}
					<div
						style={{
							width: 40,
							height: 40,
							borderRadius: "50%",
							border: `3px solid ${accent}`,
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
								background: accent,
								display: "flex",
							}}
						/>
					</div>
					{eyebrow}
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						fontSize: titleSize,
						fontWeight: 700,
						lineHeight: 1.1,
						color: "white",
						marginBottom: 20,
					}}
				>
					<span style={{ display: "flex" }}>{title}</span>
					{titleAccent && (
						<span style={{ display: "flex", color: accent }}>
							{titleAccent}
						</span>
					)}
				</div>

				<div
					style={{
						display: "flex",
						fontSize: 26,
						lineHeight: 1.4,
						color: "rgba(255,255,255,0.6)",
						marginBottom: 36,
						maxWidth: 1000,
					}}
				>
					{subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle}
				</div>

				<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
					{tags.slice(0, 6).map((tag) => (
						<div
							key={tag}
							style={{
								display: "flex",
								padding: "6px 16px",
								borderRadius: 999,
								background: `${accent}26`,
								border: `1px solid ${accent}55`,
								color: accent,
								fontSize: 16,
							}}
						>
							{tag}
						</div>
					))}
				</div>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					padding: "20px 80px",
					borderTop: "1px solid rgba(255,255,255,0.08)",
					color: "rgba(255,255,255,0.4)",
					fontSize: 18,
				}}
			>
				<span style={{ display: "flex" }}>{SITE.shortName}</span>
				<span style={{ display: "flex" }}>{host}</span>
			</div>
		</div>,
		OG_SIZE,
	);
}
