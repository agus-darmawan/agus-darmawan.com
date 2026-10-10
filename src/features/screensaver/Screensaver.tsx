"use client";

import { useFormatter, useNow, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_TIMEOUT_MS = 60_000;
const FADE_MS = 500;

const PASSIVE_EVENTS = ["pointermove", "wheel", "touchstart"] as const;
/** Inputs that would also act on the app underneath when they wake it. */
const WAKING_EVENTS = ["keydown", "pointerdown"] as const;

/**
 * Calls `onIdle` after `timeout` ms without input and `onActive` on the next
 * input. Scroll is caught in the capture phase (it doesn't bubble from the
 * windows' scroll containers), and focus inside an iframe (YouTube, PDF)
 * counts as activity because its events never reach this document. The key
 * press or click that wakes the screen is swallowed, so it can't submit a
 * terminal command or click a button hidden behind the clock.
 */
function useIdle(timeout: number, onIdle: () => void, onActive: () => void) {
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const idle = useRef(false);

	const reset = useCallback(
		(event?: Event) => {
			clearTimeout(timer.current);
			if (idle.current) {
				idle.current = false;
				onActive();
				if (
					event &&
					(WAKING_EVENTS as readonly string[]).includes(event.type)
				) {
					event.preventDefault();
					event.stopPropagation();
					if (event.type === "pointerdown") swallowNextClick();
				}
			}
			timer.current = setTimeout(() => {
				if (document.activeElement instanceof HTMLIFrameElement) {
					reset();
					return;
				}
				idle.current = true;
				onIdle();
			}, timeout);
		},
		[timeout, onIdle, onActive],
	);

	useEffect(() => {
		const passive = { passive: true, capture: true } as const;
		const active = { capture: true } as const;
		for (const e of PASSIVE_EVENTS) window.addEventListener(e, reset, passive);
		for (const e of WAKING_EVENTS) window.addEventListener(e, reset, active);
		document.addEventListener("scroll", reset, passive);
		reset();
		return () => {
			for (const e of PASSIVE_EVENTS)
				window.removeEventListener(e, reset, passive);
			for (const e of WAKING_EVENTS)
				window.removeEventListener(e, reset, active);
			document.removeEventListener("scroll", reset, passive);
			clearTimeout(timer.current);
		};
	}, [reset]);
}

function swallowNextClick() {
	const swallow = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
	};
	window.addEventListener("click", swallow, { capture: true, once: true });
	// If the press never becomes a click (drag), drop the trap.
	setTimeout(
		() => window.removeEventListener("click", swallow, { capture: true }),
		1_000,
	);
}

function ScreensaverClock() {
	const t = useTranslations("Screensaver");
	const format = useFormatter();
	const now = useNow({ updateInterval: 1_000 });
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return (
		<div className="relative flex flex-col items-center gap-4 select-none">
			<div className="flex items-end gap-3 font-light tabular-nums leading-none tracking-tight">
				<span className="text-[clamp(80px,15vw,160px)] text-white/90">
					{format.dateTime(now, {
						hour: "2-digit",
						minute: "2-digit",
						hourCycle: "h23",
						timeZone,
					})}
				</span>
				<span className="text-[clamp(32px,5vw,56px)] text-white/35 mb-3">
					{String(now.getSeconds()).padStart(2, "0")}
				</span>
			</div>

			<p className="font-light uppercase text-center tracking-[0.15em] text-[clamp(12px,2vw,18px)] text-white/40">
				{format.dateTime(now, {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
					timeZone,
				})}
			</p>

			<div className="mt-2 h-0.5 w-[clamp(40px,8vw,80px)] rounded-full bg-linear-to-r from-transparent via-ubuntu-orange to-transparent" />

			<p className="text-xs tracking-widest uppercase mt-4 animate-pulse text-white/15">
				{t("wake")}
			</p>
		</div>
	);
}

/** Stable pseudo-random particles (no Math.random in render). */
const PARTICLES = Array.from({ length: 12 }, (_, i) => {
	const r = (n: number) =>
		(((i + 1) * 9301 * (n + 1) + 49297) % 233280) / 233280;
	return {
		id: i,
		size: r(1) * 3 + 1,
		left: r(2) * 100,
		top: r(3) * 100,
		duration: 8 + r(4) * 12,
		delay: r(5) * 8,
		orange: i % 3 === 0,
	};
});

function FloatingParticles() {
	return (
		<div
			aria-hidden
			className="absolute inset-0 overflow-hidden pointer-events-none"
		>
			{PARTICLES.map((p) => (
				<span
					key={p.id}
					className={`absolute rounded-full opacity-40 animate-float-particle motion-reduce:animate-none ${p.orange ? "bg-ubuntu-orange" : "bg-white/30"}`}
					style={{
						width: p.size,
						height: p.size,
						left: `${p.left}%`,
						top: `${p.top}%`,
						animationDuration: `${p.duration}s`,
						animationDelay: `${p.delay}s`,
					}}
				/>
			))}
		</div>
	);
}

/** Lock-screen clock after a minute without input. Any input dismisses it. */
export function Screensaver() {
	const [mounted, setMounted] = useState(false);
	const [shown, setShown] = useState(false);
	const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

	const show = useCallback(() => {
		clearTimeout(hideTimer.current);
		setMounted(true);
		requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
	}, []);

	const hide = useCallback(() => {
		setShown(false);
		hideTimer.current = setTimeout(() => setMounted(false), FADE_MS);
	}, []);

	useEffect(() => () => clearTimeout(hideTimer.current), []);
	useIdle(IDLE_TIMEOUT_MS, show, hide);

	if (!mounted) return null;

	return (
		<div
			aria-hidden
			className={`fixed inset-0 z-9997 flex items-center justify-center cursor-none transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,#0d0010_0%,#000_100%)] ${shown ? "opacity-100" : "opacity-0"}`}
		>
			<FloatingParticles />
			<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_70%,rgba(119,33,111,0.2)_0%,transparent_60%)]" />
			<ScreensaverClock />
		</div>
	);
}
