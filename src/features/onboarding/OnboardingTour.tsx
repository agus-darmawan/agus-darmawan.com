"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { TOUR_STEPS } from "./tourSteps";

const STORAGE_KEY = "onboardingSeen";
const TOOLTIP_WIDTH = 288; // matches w-72
const VIEWPORT_MARGIN = 16;

interface Rect {
	top: number;
	left: number;
	width: number;
	height: number;
}

function useTargetRect(selector: string | null): Rect | null {
	const [rect, setRect] = useState<Rect | null>(null);

	useEffect(() => {
		if (!selector) {
			setRect(null);
			return;
		}
		const el = document.querySelector(selector);
		if (!el) {
			setRect(null);
			return;
		}
		const update = () => {
			const r = el.getBoundingClientRect();
			setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, [selector]);

	return rect;
}

interface OnboardingTourProps {
	onFinish?: () => void;
}

export function OnboardingTour({ onFinish }: OnboardingTourProps) {
	const t = useTranslations("Onboarding");
	const [active, setActive] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		const seen = localStorage.getItem(STORAGE_KEY);
		if (!seen) setActive(true);
	}, []);

	const step = TOUR_STEPS[stepIndex];
	const rect = useTargetRect(step?.target ?? null);

	const finish = () => {
		localStorage.setItem(STORAGE_KEY, "1");
		setActive(false);
		onFinish?.();
	};

	const next = () => {
		if (stepIndex >= TOUR_STEPS.length - 1) {
			finish();
			return;
		}
		setStepIndex((i) => i + 1);
	};

	const back = () => setStepIndex((i) => Math.max(0, i - 1));

	if (!active || !step) return null;

	const padding = 8;
	const spotlightStyle: React.CSSProperties = rect
		? {
				top: rect.top - padding,
				left: rect.left - padding,
				width: rect.width + padding * 2,
				height: rect.height + padding * 2,
			}
		: {
				top: "50%",
				left: "50%",
				width: 0,
				height: 0,
			};

	// Anchor positioning lives on a plain (non-animated) wrapper, separate
	// from the motion.div below. Framer Motion writes its own `transform`
	// for the enter/exit animation — if we put our anchor transform
	// (translateY(-100%) / translate(-50%,-50%)) on the SAME element,
	// Framer overwrites it and the tooltip ends up mispositioned. Keeping
	// them on two different elements avoids that clash entirely.
	let anchorStyle: React.CSSProperties;

	if (rect) {
		const centerX = rect.left + rect.width / 2;
		const idealLeft = centerX - TOOLTIP_WIDTH / 2;
		const maxLeft =
			(typeof window !== "undefined" ? window.innerWidth : 1024) -
			TOOLTIP_WIDTH -
			VIEWPORT_MARGIN;
		const clampedLeft = Math.min(Math.max(idealLeft, VIEWPORT_MARGIN), maxLeft);

		anchorStyle =
			step.placement === "top"
				? {
						top: rect.top - padding - 16,
						left: clampedLeft,
						transform: "translateY(-100%)",
					}
				: {
						top: rect.top + rect.height + padding + 16,
						left: clampedLeft,
					};
	} else {
		anchorStyle = {
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		};
	}

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-[9999]"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.15 }}
			>
				{/* Dim overlay via box-shadow trick — the "hole" sits at the target */}
				<div
					className="absolute rounded-xl pointer-events-none transition-all duration-300"
					style={{
						...spotlightStyle,
						boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
						border: rect ? "2px solid rgba(233,84,32,0.8)" : "none",
					}}
				/>

				{/* Clicking the dark area does nothing — user drives via the buttons */}
				<div
					className="absolute inset-0"
					onClick={(e) => e.stopPropagation()}
				/>

				{/* Plain wrapper — owns the anchor transform, untouched by Framer Motion */}
				<div key={step.id} className="absolute w-72" style={anchorStyle}>
					<motion.div
						className="rounded-lg p-4 shadow-ubuntu-lg"
						style={{
							background: "var(--window-bg)",
							color: "var(--text-primary)",
							border: "1px solid var(--topbar-border)",
						}}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
					>
						<h3 className="font-semibold mb-1">{t(step.titleKey)}</h3>
						<p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
							{t(step.bodyKey)}
						</p>

						<div className="flex items-center justify-between">
							<button
								type="button"
								onClick={finish}
								className="text-xs opacity-60 hover:opacity-100"
							>
								{t("skip")}
							</button>

							<div className="flex items-center gap-2">
								{stepIndex > 0 && (
									<button
										type="button"
										onClick={back}
										className="text-xs px-2 py-1 rounded hover:bg-black/10"
									>
										{t("back")}
									</button>
								)}
								<button
									type="button"
									onClick={next}
									className="text-xs px-3 py-1 rounded bg-[#e95420] text-white hover:opacity-90"
								>
									{stepIndex === TOUR_STEPS.length - 1
										? t("finish")
										: t("next")}
								</button>
							</div>
						</div>

						<div className="flex gap-1 mt-3">
							{TOUR_STEPS.map((s, i) => (
								<span
									key={s.id}
									className="h-1 flex-1 rounded-full"
									style={{
										background:
											i <= stepIndex ? "#e95420" : "rgba(255,255,255,0.2)",
									}}
								/>
							))}
						</div>
					</motion.div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
