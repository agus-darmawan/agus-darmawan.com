"use client";

import { useEffect, useState } from "react";

// ── Config ────────────────────────────────────────────────────────────────────

const BOOT_MESSAGES: {
	text: string;
	type: "ok" | "warn" | "info";
	delay: number;
}[] = [
	{ text: "Initializing hardware drivers...", type: "info", delay: 0 },
	{ text: "Started Spotify Integration Service", type: "ok", delay: 350 },
	{ text: "Loaded project data from cache", type: "ok", delay: 650 },
	{ text: "Initialized window manager", type: "ok", delay: 900 },
	{ text: "Mounted portfolio filesystem", type: "ok", delay: 1100 },
	{ text: "Started i18n locale service (en, id)", type: "ok", delay: 1300 },
	{ text: "Coffee level critically low", type: "warn", delay: 1550 },
	{ text: "Portfolio ready. Welcome.", type: "ok", delay: 1850 },
];

const TOTAL_MS = 2300;

// ── Component ─────────────────────────────────────────────────────────────────

interface BootScreenProps {
	onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
	const [visibleCount, setVisibleCount] = useState(0);
	const [progress, setProgress] = useState(0);
	const [exiting, setExiting] = useState(false);

	// Reveal messages one by one
	useEffect(() => {
		const timers = BOOT_MESSAGES.map((msg, i) =>
			setTimeout(() => setVisibleCount(i + 1), msg.delay),
		);
		return () => timers.forEach(clearTimeout);
	}, []);

	// Smooth progress bar via rAF
	useEffect(() => {
		const start = performance.now();
		let raf: number;

		const tick = () => {
			const pct = Math.min(((performance.now() - start) / TOTAL_MS) * 100, 100);
			setProgress(pct);
			if (pct < 100) {
				raf = requestAnimationFrame(tick);
			} else {
				// Fade out then call onDone
				setTimeout(() => {
					setExiting(true);
					setTimeout(onDone, 400);
				}, 200);
			}
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [onDone]);

	return (
		<div
			className="fixed inset-0 z-9999 flex flex-col bg-black select-none transition-opacity duration-400"
			style={{ opacity: exiting ? 0 : 1 }}
		>
			{/* ── Top section — logo + distro name ─────────────────── */}
			<div className="flex-1 flex flex-col items-center justify-center gap-10">
				{/* Ubuntu-style logo — pure CSS, no image */}
				<div className="relative w-20 h-20">
					{/* Outer ring */}
					<div
						className="absolute inset-0 rounded-full border-[3px]"
						style={{ borderColor: "#e95420" }}
					/>
					{/* Three dots around the circle */}
					{[0, 120, 240].map((deg) => (
						<div
							key={deg}
							className="absolute w-3.5 h-3.5 rounded-full"
							style={{
								background: "#e95420",
								top: "50%",
								left: "50%",
								transform: `rotate(${deg}deg) translateX(28px) translate(-50%, -50%)`,
							}}
						/>
					))}
					{/* Center dot */}
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
						style={{ background: "#e95420" }}
					/>
				</div>

				{/* Distro name */}
				<div className="text-center space-y-1">
					<p className="text-white font-light text-lg tracking-[0.2em] uppercase">
						Ubuntu
					</p>
					<p
						className="text-xs tracking-widest uppercase"
						style={{ color: "rgba(255,255,255,0.35)" }}
					>
						22.04.3 LTS · darm@wan
					</p>
				</div>

				{/* Progress bar */}
				<div className="w-52 space-y-2">
					<div
						className="w-full h-0.75 rounded-full overflow-hidden"
						style={{ background: "rgba(255,255,255,0.08)" }}
					>
						<div
							className="h-full rounded-full"
							style={{
								width: `${progress}%`,
								background: "linear-gradient(90deg, #e95420, #f97316)",
								transition: "width 50ms linear",
								boxShadow: "0 0 8px #e9542060",
							}}
						/>
					</div>
					<p
						className="text-center text-[10px] tabular-nums font-mono"
						style={{ color: "rgba(255,255,255,0.25)" }}
					>
						{Math.round(progress)}%
					</p>
				</div>
			</div>

			{/* ── Bottom section — boot log ─────────────────────────── */}
			<div
				className="px-8 pb-10 font-mono text-[11px] space-y-0.75"
				style={{ maxHeight: "200px" }}
			>
				{BOOT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
					<div
						key={i}
						className="flex items-start gap-2 leading-5"
						style={{
							opacity: i < visibleCount - 3 ? 0.35 : 1,
							transition: "opacity 0.5s ease",
						}}
					>
						{/* Status badge */}
						<span
							className="shrink-0 font-bold"
							style={{
								color:
									msg.type === "ok"
										? "#4ade80"
										: msg.type === "warn"
											? "#fbbf24"
											: "rgba(255,255,255,0.4)",
							}}
						>
							{msg.type === "ok"
								? "[ OK ]"
								: msg.type === "warn"
									? "[WARN]"
									: "[    ]"}
						</span>
						{/* Message */}
						<span style={{ color: "rgba(255,255,255,0.55)" }}>{msg.text}</span>
					</div>
				))}

				{/* Blinking cursor after last message */}
				{visibleCount > 0 && visibleCount <= BOOT_MESSAGES.length && (
					<div className="flex items-center gap-2">
						<span style={{ color: "rgba(255,255,255,0.2)" }}>{"      "}</span>
						<span
							className="w-2 h-3 inline-block animate-pulse"
							style={{ background: "#e95420" }}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
