"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Status = "ok" | "warn" | "info";

const BOOT_MESSAGES: { text: string; status: Status; delay: number }[] = [
	{ text: "Initializing hardware drivers...", status: "info", delay: 0 },
	{ text: "Started Spotify Integration Service", status: "ok", delay: 350 },
	{ text: "Loaded project data from cache", status: "ok", delay: 650 },
	{ text: "Initialized window manager", status: "ok", delay: 900 },
	{ text: "Mounted portfolio filesystem", status: "ok", delay: 1100 },
	{ text: "Started i18n locale service (en, id)", status: "ok", delay: 1300 },
	{ text: "Coffee level critically low", status: "warn", delay: 1550 },
	{ text: "Portfolio ready. Welcome.", status: "ok", delay: 1850 },
];

const BADGE: Record<Status, { label: string; className: string }> = {
	ok: { label: "[ OK ]", className: "text-green-400" },
	warn: { label: "[WARN]", className: "text-amber-400" },
	info: { label: "[    ]", className: "text-white/40" },
};

const TOTAL_MS = 2300;
const FADE_MS = 400;

/** First-visit boot sequence. Any key or click skips it. */
export function BootScreen({ onDone }: { onDone: () => void }) {
	const [visibleCount, setVisibleCount] = useState(0);
	const [progress, setProgress] = useState(0);
	const [exiting, setExiting] = useState(false);
	const done = useRef(onDone);
	useEffect(() => {
		done.current = onDone;
	});

	useEffect(() => {
		const timers = BOOT_MESSAGES.map((msg, i) =>
			setTimeout(() => setVisibleCount(i + 1), msg.delay),
		);
		return () => timers.forEach(clearTimeout);
	}, []);

	useEffect(() => {
		const start = performance.now();
		let raf = 0;
		let exitTimer: ReturnType<typeof setTimeout> | undefined;

		const finish = () => {
			cancelAnimationFrame(raf);
			setProgress(100);
			setExiting(true);
			exitTimer = setTimeout(() => done.current(), FADE_MS);
		};

		const tick = () => {
			const pct = Math.min(((performance.now() - start) / TOTAL_MS) * 100, 100);
			setProgress(pct);
			if (pct < 100) raf = requestAnimationFrame(tick);
			else finish();
		};
		raf = requestAnimationFrame(tick);

		const skip = () => finish();
		window.addEventListener("keydown", skip, { once: true });
		window.addEventListener("pointerdown", skip, { once: true });

		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(exitTimer);
			window.removeEventListener("keydown", skip);
			window.removeEventListener("pointerdown", skip);
		};
	}, []);

	return (
		<div
			className={cn(
				"fixed inset-0 z-9999 flex flex-col bg-black select-none transition-opacity duration-400",
				exiting && "opacity-0",
			)}
		>
			<div className="flex-1 flex flex-col items-center justify-center gap-10">
				{/* Ubuntu-style logo — pure CSS */}
				<div aria-hidden className="relative w-20 h-20">
					<div className="absolute inset-0 rounded-full border-3 border-ubuntu-orange" />
					{[0, 120, 240].map((deg) => (
						<div
							key={deg}
							className="absolute top-1/2 left-1/2 w-3.5 h-3.5 rounded-full bg-ubuntu-orange"
							style={{
								transform: `rotate(${deg}deg) translateX(28px) translate(-50%, -50%)`,
							}}
						/>
					))}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-ubuntu-orange" />
				</div>

				<div className="text-center space-y-1">
					<p className="text-white font-light text-lg tracking-[0.2em] uppercase">
						Ubuntu
					</p>
					<p className="text-xs tracking-widest uppercase text-white/35">
						22.04.3 LTS · agus@ubuntu
					</p>
				</div>

				<div className="w-52 space-y-2">
					<div
						role="progressbar"
						aria-label="Booting"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(progress)}
						className="w-full h-0.75 rounded-full overflow-hidden bg-white/8"
					>
						<div
							className="h-full rounded-full bg-linear-to-r from-ubuntu-orange to-orange-500 shadow-[0_0_8px_#e9542060]"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<p className="text-center text-[10px] tabular-nums font-mono text-white/25">
						{Math.round(progress)}%
					</p>
				</div>
			</div>

			<div className="px-8 pb-10 font-mono text-[11px] space-y-0.75 max-h-50">
				{BOOT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
					<div
						key={msg.text}
						className={cn(
							"flex items-start gap-2 leading-5 transition-opacity duration-500",
							i < visibleCount - 3 && "opacity-35",
						)}
					>
						<span
							className={cn(
								"shrink-0 font-bold whitespace-pre",
								BADGE[msg.status].className,
							)}
						>
							{BADGE[msg.status].label}
						</span>
						<span className="text-white/55">{msg.text}</span>
					</div>
				))}

				{visibleCount > 0 && (
					<div aria-hidden className="flex items-center gap-2">
						<span className="w-11.5" />
						<span className="w-2 h-3 inline-block animate-pulse bg-ubuntu-orange" />
					</div>
				)}
			</div>
		</div>
	);
}
