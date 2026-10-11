"use client";

import { Languages, Moon, Search, Sun, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { APPS } from "@/config/apps";
import { useSwitchLocale } from "@/hooks/useSwitchLocale";
import { cn } from "@/lib/utils";
import { useWindowStore } from "@/store/useWindowStore";

interface Command {
	id: string;
	label: string;
	sublabel: string;
	icon: ReactNode;
	action: () => void;
	keywords: string[];
}

/** Ctrl/⌘ + K launcher for apps, theme and language. */
export function CommandPalette() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const listId = useId();

	const t = useTranslations("CommandPalette");
	const tApps = useTranslations("Dock");
	const { resolvedTheme, setTheme } = useTheme();
	const { locale, switchLocale } = useSwitchLocale();
	const openWindow = useWindowStore((s) => s.openWindow);
	const isDark = resolvedTheme !== "light";

	const commands = useMemo<Command[]>(
		() => [
			...APPS.map(({ id, icon: Icon }) => ({
				id: `open-${id}`,
				label: tApps(id),
				sublabel: t("openWindow"),
				icon: <Icon size={14} aria-hidden />,
				action: () => openWindow(id),
				keywords: [id, ...t(`keywords.${id}`).split(",")],
			})),
			{
				id: "toggle-theme",
				label: isDark ? t("lightMode") : t("darkMode"),
				sublabel: t("toggleTheme"),
				icon: isDark ? (
					<Sun size={14} aria-hidden />
				) : (
					<Moon size={14} aria-hidden />
				),
				action: () => setTheme(isDark ? "light" : "dark"),
				keywords: ["theme", "dark", "light", "mode", "tema"],
			},
			{
				id: "switch-lang",
				label: locale === "en" ? "Bahasa Indonesia" : "English",
				sublabel: t("changeLanguage"),
				icon: <Languages size={14} aria-hidden />,
				action: () => switchLocale(),
				keywords: ["language", "lang", "bahasa", "english", "indonesia"],
			},
		],
		[isDark, locale, openWindow, setTheme, switchLocale, t, tApps],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return commands;
		return commands.filter((cmd) =>
			[cmd.label, cmd.sublabel, ...cmd.keywords].some((s) =>
				s.toLowerCase().includes(q),
			),
		);
	}, [commands, query]);

	const close = useCallback(() => {
		setOpen(false);
		setQuery("");
		setSelected(0);
	}, []);

	useEffect(() => {
		const onKey = (e: globalThis.KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((v) => !v);
				setQuery("");
				setSelected(0);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	// Dismissing returns focus to where it was; running a command doesn't —
	// refocusing the previous window would raise it over the app just opened.
	const restoreFocus = useRef(true);
	useEffect(() => {
		if (!open) return;
		restoreFocus.current = true;
		const previous = document.activeElement as HTMLElement | null;
		const id = requestAnimationFrame(() => inputRef.current?.focus());
		return () => {
			cancelAnimationFrame(id);
			if (restoreFocus.current) previous?.focus?.({ preventScroll: true });
		};
	}, [open]);

	const run = (cmd: Command) => {
		restoreFocus.current = false;
		close();
		cmd.action();
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const last = filtered.length - 1;
		switch (e.key) {
			case "Escape":
				e.preventDefault();
				close();
				break;
			case "ArrowDown":
				e.preventDefault();
				setSelected((i) => (i >= last ? 0 : i + 1));
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelected((i) => (i <= 0 ? last : i - 1));
				break;
			case "Enter": {
				e.preventDefault();
				const cmd = filtered[selected];
				if (cmd) run(cmd);
				break;
			}
		}
	};

	if (!open) return null;

	const optionId = (i: number) => `${listId}-${i}`;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: backdrop click is a mouse shortcut; Escape closes for keyboard users
		<div
			className="fixed inset-0 z-9998 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm"
			onClick={(e) => {
				if (e.target === e.currentTarget) close();
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("title")}
				className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in bg-(--panel-bg) border border-(--panel-border) text-(--panel-text)"
			>
				<div className="flex items-center gap-3 px-4 py-3 border-b border-(--panel-border)">
					<Search
						className="w-4 h-4 shrink-0 text-(--panel-text-muted)"
						aria-hidden
					/>
					<input
						ref={inputRef}
						type="text"
						role="combobox"
						aria-expanded="true"
						aria-controls={listId}
						aria-activedescendant={
							filtered[selected] ? optionId(selected) : undefined
						}
						aria-label={t("placeholder")}
						placeholder={t("placeholder")}
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setSelected(0);
						}}
						onKeyDown={onKeyDown}
						className="flex-1 bg-transparent outline-none text-sm"
					/>
					<button
						type="button"
						title={t("close")}
						aria-label={t("close")}
						onClick={close}
						className="shrink-0 p-1 rounded transition-colors text-(--panel-text-muted) hover:bg-(--panel-hover)"
					>
						<X size={14} aria-hidden />
					</button>
				</div>

				<div
					id={listId}
					role="listbox"
					aria-label={t("title")}
					className="py-1.5 max-h-80 overflow-auto"
				>
					{filtered.length === 0 ? (
						<p
							role="status"
							className="text-xs text-center py-6 text-(--panel-text-muted)"
						>
							{t("empty")}
						</p>
					) : (
						filtered.map((cmd, i) => {
							const active = i === selected;
							return (
								// biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/useFocusableInteractive: combobox pattern — focus stays in the input, options are driven by aria-activedescendant and arrow keys
								<div
									key={cmd.id}
									id={optionId(i)}
									role="option"
									aria-selected={active}
									onClick={() => run(cmd)}
									onMouseMove={() => setSelected(i)}
									className={cn(
										"flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
										active && "bg-ubuntu-orange/15",
									)}
								>
									<span
										className={cn(
											"w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
											active
												? "bg-ubuntu-orange/20 text-ubuntu-orange"
												: "bg-white/6 text-(--panel-text-muted)",
										)}
									>
										{cmd.icon}
									</span>
									<span className="flex-1 min-w-0">
										<span className="block text-sm font-medium truncate">
											{cmd.label}
										</span>
										<span className="block text-[10px] truncate text-(--panel-text-muted)">
											{cmd.sublabel}
										</span>
									</span>
									{active && <Kbd>↵</Kbd>}
								</div>
							);
						})
					)}
				</div>

				<div className="flex items-center gap-3 px-4 py-2 border-t border-(--panel-border) text-[10px] text-(--panel-text-muted)">
					<span>
						<kbd className="font-mono">↑↓</kbd> {t("navigate")}
					</span>
					<span>
						<kbd className="font-mono">↵</kbd> {t("select")}
					</span>
					<span>
						<kbd className="font-mono">Esc</kbd> {t("close")}
					</span>
					<span className="ml-auto">
						<kbd className="font-mono">Ctrl/⌘ K</kbd>
					</span>
				</div>
			</div>
		</div>
	);
}

function Kbd({ children }: { children: ReactNode }) {
	return (
		<kbd className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-mono bg-white/8 text-(--panel-text-muted) border border-white/10">
			{children}
		</kbd>
	);
}
