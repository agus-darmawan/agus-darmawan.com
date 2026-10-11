"use client";

import { BatteryFull, Grip, Volume2, Wifi } from "lucide-react";
import { useFormatter, useNow, useTranslations } from "next-intl";
import {
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import { accentStyle } from "@/components/content/primitives";
import { APPS } from "@/config/apps";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useMounted } from "@/hooks/useMounted";
import type { ProjectMeta } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { buttonClass } from "../button";
import { DesktopLink } from "../DesktopLink";

/** What the terminal types. Both commands do the same in the real one. */
const SCRIPT = [
	{ command: "whoami", output: "agus" },
	{ command: "open projects", output: "Opening projects…" },
];

interface Frame {
	/** Commands already run (shown with their output). */
	done: number;
	/** The command being typed at the prompt. */
	typed: string;
	/** The Projects window has opened. */
	open: boolean;
	/** Wait before this frame, in ms. */
	delay: number;
}

const FRAMES: Frame[] = [{ done: 0, typed: "", open: false, delay: 0 }];
SCRIPT.forEach(({ command }, step) => {
	for (let n = 1; n <= command.length; n++) {
		FRAMES.push({
			done: step,
			typed: command.slice(0, n),
			open: false,
			// A little unevenness reads as typing, not a ticker.
			delay: n === 1 ? 650 : 70 + ((n * 37) % 45),
		});
	}
	FRAMES.push({ done: step + 1, typed: "", open: false, delay: 420 });
});
FRAMES.push({ done: SCRIPT.length, typed: "", open: true, delay: 300 });

const LAST = FRAMES.length - 1;

/** True once the element has been half on screen. */
function useSeen(ref: RefObject<Element | null>) {
	const [seen, setSeen] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el || seen) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) setSeen(true);
			},
			{ threshold: 0.5 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [ref, seen]);
	return seen;
}

/** Plays the script once; reduced motion shows the end state right away. */
function useFrame(start: boolean): Frame {
	const reduced = useReducedMotion();
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (!start || reduced || index >= LAST) return;
		const id = window.setTimeout(
			() => setIndex(index + 1),
			FRAMES[index + 1].delay,
		);
		return () => window.clearTimeout(id);
	}, [index, start, reduced]);

	return FRAMES[reduced ? LAST : index];
}

function Clock() {
	const format = useFormatter();
	const now = useNow({ updateInterval: 30_000 });
	// The visitor's clock, so it can only render after hydration.
	if (!useMounted()) return null;
	return (
		<span className="tabular-nums">
			{format.dateTime(now, {
				weekday: "short",
				hour: "2-digit",
				minute: "2-digit",
				hourCycle: "h23",
			})}
		</span>
	);
}

function Lights() {
	return (
		<span className="flex gap-[0.6cqw]">
			<span className="size-[1.35cqw] rounded-full bg-[#f46067]" />
			<span className="size-[1.35cqw] rounded-full bg-[#f6a847]" />
			<span className="size-[1.35cqw] rounded-full bg-[#64c550]" />
		</span>
	);
}

function MiniWindow({
	title,
	className,
	children,
}: {
	title: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div
			className={cn(
				"absolute flex flex-col overflow-hidden rounded-[0.9cqw] shadow-[0_1.4cqw_4cqw_rgb(0_0_0/0.45)]",
				className,
			)}
		>
			<div className="flex h-[4cqw] shrink-0 items-center gap-[1.2cqw] border-b border-(--site-line) bg-(--site-raised) px-[1.3cqw]">
				<Lights />
				<span className="truncate text-[1.5cqw] font-medium text-(--site-ink)">
					{title}
				</span>
			</div>
			{children}
		</div>
	);
}

const PROMPT = "agus@ubuntu:~$";

function PromptLine({
	command,
	cursor,
}: {
	command: string;
	cursor?: boolean;
}) {
	return (
		<p className="whitespace-pre text-[#4ec9b0]">
			{PROMPT} <span className="text-[#e6edf3]">{command}</span>
			{cursor && (
				<span className="ml-[0.1cqw] inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-[#4ec9b0] animate-caret" />
			)}
		</p>
	);
}

/**
 * The home page's one loud element: a small, live picture of the desktop.
 * The terminal types two real commands and the Projects window opens with
 * the real featured projects. Clicking anywhere on it launches the desktop.
 */
export function DesktopPreview({ projects }: { projects: ProjectMeta[] }) {
	const t = useTranslations("Site.hero");
	const tApps = useTranslations("Dock");
	const tBar = useTranslations("TopBar");
	const ref = useRef<HTMLElement>(null);
	const frame = useFrame(useSeen(ref));

	return (
		<figure ref={ref} className="min-w-0">
			{/* Decorative duplicate of the launch button below: hidden from
			    assistive tech and the tab order, clickable for the mouse. */}
			<DesktopLink
				aria-hidden="true"
				tabIndex={-1}
				className="@container relative block aspect-[16/10] select-none overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_30%_40%,#3d1145_0%,#1a0828_45%,#0d0010_100%)] shadow-[0_2rem_4rem_-1.5rem_rgb(44_0_30/0.55)] ring-1 ring-black/10 transition-transform duration-300 hover:-translate-y-1 dark:ring-white/10"
			>
				{/* Top bar */}
				<div className="absolute inset-x-0 top-0 flex h-[3.6cqw] items-center justify-between bg-[#120c10]/95 px-[1.6cqw] text-[1.45cqw] text-white/90">
					<span className="font-medium">{tBar("activities")}</span>
					<span className="absolute left-1/2 -translate-x-1/2 font-medium">
						<Clock />
					</span>
					<span className="flex items-center gap-[0.9cqw] [&_svg]:size-[1.7cqw]">
						<Wifi />
						<Volume2 />
						<BatteryFull />
					</span>
				</div>

				{/* Terminal */}
				<MiniWindow
					title={tApps("terminal")}
					className="left-[5%] top-[12%] h-[56%] w-[57%]"
				>
					<div className="flex-1 space-y-[0.3cqw] bg-[#0d1117] px-[1.7cqw] py-[1.4cqw] font-mono text-[1.75cqw] leading-[1.45] text-[#cdd9e5]">
						{SCRIPT.slice(0, frame.done).map(({ command, output }) => (
							<div key={command}>
								<PromptLine command={command} />
								<p>{output}</p>
							</div>
						))}
						<PromptLine command={frame.typed} cursor />
					</div>
				</MiniWindow>

				{/* Projects, opened by the terminal */}
				<MiniWindow
					title={tApps("projects")}
					className={cn(
						"right-[5%] top-[33%] w-[46%] bg-(--site-bg) transition-[opacity,scale,translate] duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1.15)] motion-reduce:transition-none",
						frame.open
							? "scale-100 opacity-100"
							: "translate-y-[3cqw] scale-90 opacity-0",
					)}
				>
					<ul className="space-y-[1.1cqw] px-[1.6cqw] py-[1.5cqw]">
						{projects.map((project) => (
							<li
								key={project.slug}
								style={accentStyle(project.color)}
								className="flex items-center gap-[1.2cqw]"
							>
								<span className="grid size-[3.6cqw] shrink-0 place-items-center rounded-[0.7cqw] bg-(--accent)/15 text-[1.9cqw]">
									{project.emoji}
								</span>
								<span className="min-w-0">
									<span className="block truncate text-[1.55cqw] font-medium text-(--site-ink)">
										{project.title}
									</span>
									<span className="block truncate text-[1.3cqw] text-(--site-muted)">
										{project.tags.slice(0, 3).join(", ")}
									</span>
								</span>
							</li>
						))}
					</ul>
				</MiniWindow>

				{/* Dock */}
				<div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-[0.7cqw] rounded-t-[1.1cqw] border border-b-0 border-white/10 bg-[#111] px-[1.2cqw] pt-[0.9cqw] pb-[1.3cqw]">
					<span className="grid size-[4.3cqw] place-items-center rounded-[0.9cqw] bg-white/8 text-white/75">
						<Grip className="size-[2.6cqw]" />
					</span>
					<span className="mx-[0.3cqw] h-[3cqw] w-px bg-white/10" />
					{APPS.map(({ id, icon: Icon, color }) => {
						const running =
							id === "terminal" || (id === "projects" && frame.open);
						return (
							<span
								key={id}
								className={cn(
									"relative grid size-[4.3cqw] place-items-center rounded-[0.9cqw] text-white",
									color,
								)}
							>
								<Icon className="size-[2.2cqw]" />
								<span
									className={cn(
										"absolute -bottom-[0.85cqw] size-[0.45cqw] rounded-full bg-white transition-opacity",
										running ? "opacity-100" : "opacity-0",
									)}
								/>
							</span>
						);
					})}
				</div>
			</DesktopLink>

			<figcaption className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
				<div className="min-w-0 max-w-[46ch]">
					<p className="font-medium text-(--site-ink)">{t("previewTitle")}</p>
					<p className="mt-1 text-(--site-muted)">{t("previewBody")}</p>
				</div>
				<DesktopLink className={buttonClass("launch")}>
					{t("launch")}
				</DesktopLink>
			</figcaption>
		</figure>
	);
}
