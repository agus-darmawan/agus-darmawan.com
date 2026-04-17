"use client";

import {
	BookOpen,
	Briefcase,
	FileText,
	Folder,
	Languages,
	Mail,
	Moon,
	Sun,
	Terminal,
	User,
	X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useWindowStore } from "@/store/useWindowStore";

interface Command {
	id: string;
	label: string;
	sublabel?: string;
	icon: React.ReactNode;
	action: () => void;
	keywords?: string[];
}

export function CommandPalette() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [selectedIdx, setSelectedIdx] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const filteredRef = useRef<Command[]>([]);
	const selectedIdxRef = useRef(0);

	const { theme, setTheme } = useTheme();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const openWindow = useWindowStore((s) => s.openWindow);
	const tDock = useTranslations("Dock");

	const isDark = theme === "dark";

	const commands: Command[] = useMemo(
		() => [
			{
				id: "open-about",
				label: tDock("about"),
				sublabel: "Open window",
				icon: <User size={14} />,
				action: () => openWindow("about"),
				keywords: ["about", "me", "bio"],
			},
			{
				id: "open-experience",
				label: tDock("experience"),
				sublabel: "Open window",
				icon: <Briefcase size={14} />,
				action: () => openWindow("experience"),
				keywords: ["experience", "work", "job"],
			},
			{
				id: "open-projects",
				label: tDock("projects"),
				sublabel: "Open window",
				icon: <Folder size={14} />,
				action: () => openWindow("projects"),
				keywords: ["projects", "portfolio", "code"],
			},
			{
				id: "open-resume",
				label: tDock("resume"),
				sublabel: "Open window",
				icon: <FileText size={14} />,
				action: () => openWindow("resume"),
				keywords: ["resume", "cv", "pdf"],
			},
			{
				id: "open-blog",
				label: tDock("blog"),
				sublabel: "Open window",
				icon: <BookOpen size={14} />,
				action: () => openWindow("blog"),
				keywords: ["blog", "writing", "posts", "articles"],
			},
			{
				id: "open-contact",
				label: tDock("contact"),
				sublabel: "Open window",
				icon: <Mail size={14} />,
				action: () => openWindow("contact"),
				keywords: ["contact", "email", "message"],
			},
			{
				id: "open-terminal",
				label: tDock("terminal"),
				sublabel: "Open window",
				icon: <Terminal size={14} />,
				action: () => openWindow("terminal"),
				keywords: ["terminal", "cli", "bash"],
			},
			{
				id: "toggle-theme",
				label: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
				sublabel: "Toggle theme",
				icon: isDark ? <Sun size={14} /> : <Moon size={14} />,
				action: () => setTheme(isDark ? "light" : "dark"),
				keywords: ["theme", "dark", "light", "mode"],
			},
			{
				id: "switch-lang",
				label:
					locale === "en" ? "Switch to Bahasa Indonesia" : "Switch to English",
				sublabel: "Change language",
				icon: <Languages size={14} />,
				action: () =>
					router.push(pathname, { locale: locale === "en" ? "id" : "en" }),
				keywords: ["language", "lang", "bahasa", "english"],
			},
		],
		[isDark, locale, openWindow, pathname, router, setTheme, tDock],
	);

	const filtered = useMemo(() => {
		if (!query.trim()) return commands;
		const q = query.toLowerCase();
		return commands.filter(
			(cmd) =>
				cmd.label.toLowerCase().includes(q) ||
				cmd.sublabel?.toLowerCase().includes(q) ||
				cmd.keywords?.some((k) => k.includes(q)),
		);
	}, [commands, query]);

	filteredRef.current = filtered;
	selectedIdxRef.current = selectedIdx;

	useEffect(() => {
		setSelectedIdx(0);
	}, []);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setOpen((v) => !v);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	useEffect(() => {
		if (open) {
			const id = requestAnimationFrame(() => inputRef.current?.focus());
			return () => cancelAnimationFrame(id);
		}
	}, [open]);

	const close = useCallback(() => {
		setOpen(false);
		setQuery("");
		setSelectedIdx(0);
	}, []);

	const runCommand = useCallback(
		(cmd: Command) => {
			cmd.action();
			close();
		},
		[close],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIdx((i) => Math.min(i + 1, filteredRef.current.length - 1));
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIdx((i) => Math.max(i - 1, 0));
			} else if (e.key === "Enter") {
				e.preventDefault();
				const cmd = filteredRef.current[selectedIdxRef.current];
				if (cmd) runCommand(cmd);
			}
		},
		[close, runCommand],
	);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-9998 flex items-start justify-center pt-24 px-4"
			style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
			onClick={(e) => {
				if (e.target === e.currentTarget) close();
			}}
		>
			<div
				className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
				style={{
					background: "var(--panel-bg)",
					border: "1px solid var(--panel-border)",
				}}
			>
				{/* Search input */}
				<div
					className="flex items-center gap-3 px-4 py-3 border-b"
					style={{ borderColor: "var(--panel-border)" }}
				>
					<svg
						className="w-4 h-4 shrink-0"
						style={{ color: "var(--panel-text-muted)" }}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						ref={inputRef}
						type="text"
						placeholder="Search commands..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						className="flex-1 bg-transparent outline-none text-sm"
						style={{
							color: "var(--panel-text)",
							outline: "none",
						}}
					/>
					<button
						title="Close"
						type="button"
						onClick={close}
						className="shrink-0 p-1 rounded transition-colors"
						style={{ color: "var(--panel-text-muted)" }}
					>
						<X size={14} />
					</button>
				</div>

				{/* Command list */}
				<div className="py-1.5 max-h-80 overflow-auto">
					{filtered.length === 0 ? (
						<p
							className="text-xs text-center py-6"
							style={{ color: "var(--panel-text-muted)" }}
						>
							No commands found
						</p>
					) : (
						filtered.map((cmd, i) => (
							<button
								key={cmd.id}
								type="button"
								onClick={() => runCommand(cmd)}
								onMouseEnter={() => setSelectedIdx(i)}
								className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
								style={{
									background:
										i === selectedIdx ? "rgba(233,84,32,0.15)" : "transparent",
									color: "var(--panel-text)",
								}}
							>
								<div
									className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
									style={{
										background:
											i === selectedIdx
												? "rgba(233,84,32,0.2)"
												: "rgba(255,255,255,0.06)",
										color:
											i === selectedIdx ? "#e95420" : "var(--panel-text-muted)",
									}}
								>
									{cmd.icon}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{cmd.label}</p>
									{cmd.sublabel && (
										<p
											className="text-[10px] truncate"
											style={{ color: "var(--panel-text-muted)" }}
										>
											{cmd.sublabel}
										</p>
									)}
								</div>
								{i === selectedIdx && (
									<kbd
										className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-mono"
										style={{
											background: "rgba(255,255,255,0.08)",
											color: "var(--panel-text-muted)",
											border: "1px solid rgba(255,255,255,0.1)",
										}}
									>
										↵
									</kbd>
								)}
							</button>
						))
					)}
				</div>

				{/* Footer */}
				<div
					className="flex items-center gap-3 px-4 py-2 border-t text-[10px]"
					style={{
						borderColor: "var(--panel-border)",
						color: "var(--panel-text-muted)",
					}}
				>
					<span>
						<kbd className="font-mono">↑↓</kbd> navigate
					</span>
					<span>
						<kbd className="font-mono">↵</kbd> select
					</span>
					<span>
						<kbd className="font-mono">Esc</kbd> close
					</span>
					<span className="ml-auto">
						<kbd className="font-mono">⌘K</kbd> toggle
					</span>
				</div>
			</div>
		</div>
	);
}
