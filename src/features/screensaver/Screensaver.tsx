"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Config ────────────────────────────────────────────────────────────────────

const IDLE_TIMEOUT_MS = 30_000; // 1 minute idle → screensaver
const FADE_DURATION_MS = 500;

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useIdleTimer(
	timeout: number,
	onIdle: () => void,
	onActive: () => void,
) {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isIdleRef = useRef(false);

	const resetTimer = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);

		if (isIdleRef.current) {
			isIdleRef.current = false;
			onActive();
		}

		timerRef.current = setTimeout(() => {
			isIdleRef.current = true;
			onIdle();
		}, timeout);
	}, [timeout, onIdle, onActive]);

	useEffect(() => {
		const events = [
			"mousemove",
			"mousedown",
			"keydown",
			"touchstart",
			"scroll",
		];

		events.forEach((e) =>
			window.addEventListener(e, resetTimer, { passive: true }),
		);
		resetTimer(); // start timer immediately

		return () => {
			events.forEach((e) => window.removeEventListener(e, resetTimer));
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [resetTimer]);
}

// ── Clock ─────────────────────────────────────────────────────────────────────

function ScreensaverClock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const id = setInterval(() => setTime(new Date()), 1_000);
		return () => clearInterval(id);
	}, []);

	const hours = time.getHours().toString().padStart(2, "0");
	const minutes = time.getMinutes().toString().padStart(2, "0");
	const seconds = time.getSeconds().toString().padStart(2, "0");

	const dateStr = time.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="flex flex-col items-center gap-4 select-none">
			{/* Time */}
			<div className="flex items-end gap-3">
				<span
					className="font-light tabular-nums"
					style={{
						fontSize: "clamp(80px, 15vw, 160px)",
						color: "rgba(255,255,255,0.92)",
						letterSpacing: "-0.02em",
						lineHeight: 1,
						fontFamily: "var(--font-ubuntu)",
					}}
				>
					{hours}:{minutes}
				</span>
				<span
					className="font-light tabular-nums mb-3"
					style={{
						fontSize: "clamp(32px, 5vw, 56px)",
						color: "rgba(255,255,255,0.35)",
						letterSpacing: "-0.02em",
						lineHeight: 1,
						fontFamily: "var(--font-ubuntu)",
					}}
				>
					{seconds}
				</span>
			</div>

			{/* Date */}
			<p
				className="font-light tracking-widest uppercase text-center"
				style={{
					fontSize: "clamp(12px, 2vw, 18px)",
					color: "rgba(255,255,255,0.4)",
					letterSpacing: "0.15em",
				}}
			>
				{dateStr}
			</p>

			{/* Ubuntu orange accent line */}
			<div
				className="rounded-full mt-2"
				style={{
					width: "clamp(40px, 8vw, 80px)",
					height: "2px",
					background:
						"linear-gradient(90deg, transparent, #e95420, transparent)",
				}}
			/>

			{/* Hint */}
			<p
				className="text-xs tracking-widest uppercase mt-4 animate-pulse"
				style={{ color: "rgba(255,255,255,0.15)" }}
			>
				Move mouse to wake
			</p>
		</div>
	);
}

// ── Particles ─────────────────────────────────────────────────────────────────

function FloatingParticles() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{Array.from({ length: 12 }).map((_, i) => (
				<div
					key={i}
					className="absolute rounded-full"
					style={{
						width: `${Math.random() * 3 + 1}px`,
						height: `${Math.random() * 3 + 1}px`,
						background: i % 3 === 0 ? "#e95420" : "rgba(255,255,255,0.3)",
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						animation: `float-particle ${8 + Math.random() * 12}s ease-in-out infinite`,
						animationDelay: `${Math.random() * 8}s`,
						opacity: 0.4,
					}}
				/>
			))}
		</div>
	);
}

// ── Main Component ────────────────────────────────────────────────────────────

interface ScreensaverProps {
	/** Override idle timeout for testing. Default: 60s */
	idleTimeout?: number;
}

export function Screensaver({
	idleTimeout = IDLE_TIMEOUT_MS,
}: ScreensaverProps) {
	const [visible, setVisible] = useState(false);
	const [opacity, setOpacity] = useState(0);

	const showScreensaver = useCallback(() => {
		setVisible(true);
		// Small delay before fade-in for smooth transition
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setOpacity(1));
		});
	}, []);

	const hideScreensaver = useCallback(() => {
		setOpacity(0);
		setTimeout(() => setVisible(false), FADE_DURATION_MS);
	}, []);

	useIdleTimer(idleTimeout, showScreensaver, hideScreensaver);

	if (!visible) return null;

	return (
		<div
			className="fixed inset-0 z-9997 flex items-center justify-center cursor-none"
			style={{
				background:
					"radial-gradient(ellipse at center, #0d0010 0%, #000000 100%)",
				opacity,
				transition: `opacity ${FADE_DURATION_MS}ms ease`,
			}}
		>
			<FloatingParticles />

			{/* Subtle Ubuntu purple glow */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at 30% 70%, rgba(119,33,111,0.2) 0%, transparent 60%)",
				}}
			/>

			<ScreensaverClock />
		</div>
	);
}
