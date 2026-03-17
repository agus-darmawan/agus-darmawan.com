import { useCallback } from "react";
import {
	COWSAY_DEFAULT,
	MAN_PAGE,
	NEOFETCH_OUTPUT,
	RM_RF_RESPONSE,
	SUDO_RESPONSES,
} from "../terminal.easter-eggs";
import { type FSNode, mkLine, type TermLine } from "../types/terminal.types";

// ── Constants ─────────────────────────────────────────────────────────────────

const HELP_TEXT = `
╔══════════════════════════════════════════╗
║           Available Commands             ║
╠══════════════════════════════════════════╣
║  ls  [path]    list directory            ║
║  cd  <dir>     change directory          ║
║  pwd           working directory         ║
║  cat <file>    show file contents        ║
║  touch <file>  create empty file         ║
║  mkdir <dir>   create directory          ║
║  rm  <file>    remove file               ║
║  echo <text>   print text                ║
║  vim <file>    open vim editor           ║
║  git status/log/branch                   ║
║  neofetch      system info               ║
║  cowsay <msg>  talking cow               ║
║  fortune       random quote              ║
║  cal           calendar                  ║
║  history       command history           ║
║  clear         clear terminal            ║
║  whoami / date / uname -a / uptime       ║
╠══════════════════════════════════════════╣
║  Portfolio Commands                      ║
║  man agus      developer manual          ║
║  open <app>    open a window             ║
║  close         close active window       ║
║  theme <dark|light>  switch theme        ║
║  lang <en|id>  switch language           ║
╚══════════════════════════════════════════╝`.trim();

const VALID_APPS = [
	"about",
	"terminal",
	"resume",
	"experience",
	"projects",
	"contact",
];

const FORTUNES = [
	'"Talk is cheap. Show me the code." — Linus Torvalds',
	'"First, solve the problem. Then, write the code." — John Johnson',
	'"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
	'"Programs must be written for people to read." — Harold Abelson',
	'"Any fool can write code a computer understands. Good programmers write code humans understand." — M. Fowler',
	'"The best error message is the one that never shows up." — Thomas Fuchs',
	'"Fix the cause, not the symptom." — Steve Maguire',
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface UseCommandProcessorOptions {
	cwd: string;
	fs: FSNode;
	history: string[];
	addLines: (...lines: TermLine[]) => void;
	setCwd: (cwd: string) => void;
	setFs: (updater: (prev: FSNode) => FSNode) => void;
	setHistory: (updater: (prev: string[]) => string[]) => void;
	setHistIdx: (idx: number) => void;
	openVim: (filename: string, content: string) => void;
	clearTerminal: () => void;
	sessionClosedMsg: string;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCommandProcessor({
	cwd,
	fs,
	history,
	addLines,
	setCwd,
	setFs,
	setHistory,
	setHistIdx,
	openVim,
	clearTerminal,
	sessionClosedMsg,
}: UseCommandProcessorOptions) {
	const processCommand = useCallback(
		(raw: string) => {
			const trimmed = raw.trim();
			if (!trimmed) return;

			setHistory((h) => [trimmed, ...h.slice(0, 99)]);
			setHistIdx(-1);

			addLines(mkLine("input", `agus@ubuntu:${cwd}$ ${trimmed}`));

			const parts = trimmed.split(/\s+/);
			const cmd = parts[0];
			const args = parts.slice(1);

			switch (cmd) {
				// ── Help ───────────────────────────────────────────────────────
				case "help":
					addLines(mkLine("output", HELP_TEXT));
					break;

				case "clear":
					clearTerminal();
					break;

				// ── System info ───────────────────────────────────────────────
				case "pwd":
					addLines(mkLine("output", cwd.replace("~", "/home/agus")));
					break;

				case "whoami":
					addLines(mkLine("output", "agus"));
					break;

				case "date":
					addLines(mkLine("output", new Date().toString()));
					break;

				case "uname":
					addLines(
						mkLine(
							"output",
							args[0] === "-a"
								? "Linux ubuntu 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux"
								: "Linux",
						),
					);
					break;

				case "uptime": {
					addLines(mkLine("output", "Fetching stats..."));

					fetch("/api/visitors")
						.then((r) => r.json())
						.then(
							(data: { success: boolean; data: { count: number } | null }) => {
								const h = Math.floor(Math.random() * 24) + 1;
								const m = Math.floor(Math.random() * 60);
								const visitors = data?.data?.count ?? 0;

								// Replace the "Fetching stats..." line dengan real data
								addLines(
									mkLine(
										"output",
										`up ${h}:${String(m).padStart(2, "0")}, ${visitors.toLocaleString()} visitors, load average: 0.42, 0.38, 0.35`,
									),
								);
							},
						)
						.catch(() => {
							const h = Math.floor(Math.random() * 24) + 1;
							const m = Math.floor(Math.random() * 60);
							addLines(
								mkLine(
									"output",
									`up ${h}:${String(m).padStart(2, "0")}, 1 user, load average: 0.42, 0.38, 0.35`,
								),
							);
						});
					break;
				}

				// ── File system ───────────────────────────────────────────────
				case "ls": {
					const rawArg = args[0] ? args[0].replace(/\/+$/, "") : "";
					const target = rawArg
						? rawArg.startsWith("~") || rawArg.startsWith("/")
							? rawArg
							: `${cwd}/${rawArg}`
						: cwd;
					const normalTarget = target.replace("/home/agus", "~");
					const dir = fs[normalTarget];

					if (!dir) {
						addLines(
							mkLine(
								"error",
								`ls: cannot access '${target}': No such file or directory`,
							),
						);
					} else {
						const entries = Object.keys(dir);
						if (entries.length > 0)
							addLines(mkLine("output", entries.join("  ")));
					}

					const subdirs = Object.keys(fs).filter(
						(k) =>
							k !== normalTarget &&
							k.startsWith(normalTarget + "/") &&
							!k.slice(normalTarget.length + 1).includes("/"),
					);
					for (const sd of subdirs) {
						const name = sd.split("/").pop()!;
						addLines(mkLine("output", `${name}/`));
					}
					break;
				}

				case "cd": {
					const rawTarget = args[0] ?? "~";
					const target =
						rawTarget.endsWith("/") && rawTarget !== "/"
							? rawTarget.slice(0, -1)
							: rawTarget;
					let resolved: string;

					if (target === "~" || target === "") {
						resolved = "~";
					} else if (target === "..") {
						const p = cwd.split("/");
						p.pop();
						resolved = p.join("/") || "~";
					} else if (target.startsWith("~") || target.startsWith("/")) {
						resolved = target.replace("/home/agus", "~");
					} else {
						resolved = `${cwd}/${target}`;
					}

					if (fs[resolved] !== undefined) {
						setCwd(resolved);
					} else {
						addLines(
							mkLine("error", `cd: ${target}: No such file or directory`),
						);
					}
					break;
				}

				case "cat": {
					if (!args[0]) {
						addLines(mkLine("error", "cat: missing operand"));
						break;
					}
					const dir = fs[cwd];
					if (dir?.[args[0]] !== undefined) {
						addLines(mkLine("output", dir[args[0]]));
					} else {
						addLines(
							mkLine("error", `cat: ${args[0]}: No such file or directory`),
						);
					}
					break;
				}

				case "touch":
					if (!args[0]) {
						addLines(mkLine("error", "touch: missing file operand"));
					} else {
						setFs((prev) => ({
							...prev,
							[cwd]: { ...(prev[cwd] ?? {}), [args[0]]: "" },
						}));
					}
					break;

				case "mkdir":
					if (!args[0]) {
						addLines(mkLine("error", "mkdir: missing operand"));
					} else {
						setFs((prev) => ({ ...prev, [`${cwd}/${args[0]}`]: {} }));
					}
					break;

				case "rm": {
					// Easter egg: sudo rm -rf /
					if (
						args.includes("-rf") &&
						(args.includes("/") || args.includes("~"))
					) {
						addLines(mkLine("error", RM_RF_RESPONSE));
						break;
					}
					if (!args[0]) {
						addLines(mkLine("error", "rm: missing operand"));
						break;
					}
					if (fs[cwd]?.[args[0]] !== undefined) {
						setFs((prev) => {
							const next = { ...prev, [cwd]: { ...prev[cwd] } };
							delete next[cwd][args[0]];
							return next;
						});
					} else {
						addLines(
							mkLine(
								"error",
								`rm: cannot remove '${args[0]}': No such file or directory`,
							),
						);
					}
					break;
				}

				case "echo": {
					const gtIdx = args.indexOf(">");
					if (gtIdx !== -1) {
						const text = args.slice(0, gtIdx).join(" ");
						const filename = args[gtIdx + 1];
						if (filename) {
							setFs((prev) => ({
								...prev,
								[cwd]: { ...(prev[cwd] ?? {}), [filename]: text },
							}));
						}
					} else {
						addLines(mkLine("output", args.join(" ")));
					}
					break;
				}

				case "vim":
				case "nano": {
					const fname = args[0];
					if (!fname) {
						addLines(mkLine("error", `${cmd}: missing filename`));
						break;
					}
					openVim(fname, fs[cwd]?.[fname] ?? "");
					break;
				}

				case "history":
					history.forEach((h, i) => {
						addLines(
							mkLine(
								"output",
								`  ${String(history.length - i).padStart(3)}  ${h}`,
							),
						);
					});
					break;

				// ── Git ───────────────────────────────────────────────────────
				case "git": {
					const sub = args[0];
					if (sub === "status") {
						addLines(
							mkLine(
								"output",
								"On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean",
							),
						);
					} else if (sub === "log") {
						addLines(
							mkLine(
								"output",
								"commit a1b2c3d (HEAD -> main)\nAuthor: Agus Darmawan <darmawandeveloper@gmail.com>\nDate:   Mon Mar 16 10:00:00 2026 +0700\n\n    feat: add modular terminal with vim and easter eggs",
							),
						);
					} else if (sub === "branch") {
						addLines(mkLine("output", "* main\n  develop"));
					} else {
						addLines(
							mkLine(
								"error",
								`git: '${sub}' is not a git command. See 'git --help'`,
							),
						);
					}
					break;
				}

				// ── Fun commands ──────────────────────────────────────────────
				case "neofetch":
					addLines(mkLine("output", NEOFETCH_OUTPUT));
					break;

				case "cowsay": {
					const msg = args.join(" ") || "Moo!";
					const border = "-".repeat(msg.length + 2);
					addLines(
						mkLine(
							"output",
							` ${border}\n< ${msg} >\n ${border}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`,
						),
					);
					break;
				}

				case "fortune":
					addLines(
						mkLine(
							"output",
							FORTUNES[Math.floor(Math.random() * FORTUNES.length)],
						),
					);
					break;

				case "cal": {
					const now = new Date();
					const y = now.getFullYear();
					const m = now.getMonth();
					const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
					const firstDay = new Date(y, m, 1).getDay();
					const daysInMonth = new Date(y, m + 1, 0).getDate();
					const monthName = now.toLocaleString("default", {
						month: "long",
						year: "numeric",
					});
					let cal = `         ${monthName}\n${days.join(" ")}\n`;
					let row = "   ".repeat(firstDay);
					for (let d = 1; d <= daysInMonth; d++) {
						const isToday = d === now.getDate();
						// Fix: konsisten 4 chars untuk semua tanggal
						row += isToday
							? `[${String(d).padStart(2)}]`
							: ` ${String(d).padStart(2)} `;
						if ((firstDay + d) % 7 === 0 || d === daysInMonth) {
							cal += row + "\n";
							row = "";
						}
					}
					addLines(mkLine("output", cal));
					break;
				}

				// ── Easter eggs ───────────────────────────────────────────────
				case "sudo": {
					const response =
						SUDO_RESPONSES[Math.floor(Math.random() * SUDO_RESPONSES.length)];
					addLines(mkLine("error", response));
					break;
				}

				// ── Developer manual ──────────────────────────────────────────
				case "man": {
					const subject = args[0];
					if (subject === "agus" || subject === "agus-darmawan") {
						addLines(mkLine("output", MAN_PAGE));
					} else if (!subject) {
						addLines(
							mkLine("error", "What manual page do you want?\nTry: man agus"),
						);
					} else {
						addLines(
							mkLine("error", `No manual entry for ${subject}\nTry: man agus`),
						);
					}
					break;
				}

				// ── Portfolio UI commands ──────────────────────────────────────
				case "open": {
					const appId = args[0];
					if (!appId) {
						addLines(
							mkLine(
								"error",
								`open: missing app name\nUsage: open <${VALID_APPS.join("|")}>`,
							),
						);
						break;
					}
					if (!VALID_APPS.includes(appId)) {
						addLines(
							mkLine(
								"error",
								`open: unknown app '${appId}'\nAvailable: ${VALID_APPS.join(", ")}`,
							),
						);
						break;
					}
					window.dispatchEvent(
						new CustomEvent("openApp", { detail: { appId } }),
					);
					addLines(mkLine("output", `Opening ${appId}...`));
					break;
				}

				case "close": {
					window.dispatchEvent(new CustomEvent("closeActiveWindow"));
					addLines(mkLine("output", "Closed active window."));
					break;
				}

				case "theme": {
					const mode = args[0];
					if (mode !== "dark" && mode !== "light") {
						addLines(mkLine("error", "Usage: theme <dark|light>"));
						break;
					}
					window.dispatchEvent(new CustomEvent("setTheme", { detail: mode }));
					addLines(mkLine("output", `Theme set to ${mode}.`));
					break;
				}

				case "lang": {
					const locale = args[0];
					if (locale !== "en" && locale !== "id") {
						addLines(mkLine("error", "Usage: lang <en|id>"));
						break;
					}
					window.dispatchEvent(
						new CustomEvent("setLocale", { detail: locale }),
					);
					addLines(mkLine("output", `Language set to ${locale}.`));
					break;
				}

				case "exit":
					addLines(mkLine("system", sessionClosedMsg));
					break;

				default:
					addLines(
						mkLine(
							"error",
							`${cmd}: command not found\nType 'help' for available commands.`,
						),
					);
			}
		},
		[
			cwd,
			fs,
			history,
			addLines,
			setCwd,
			setFs,
			setHistory,
			setHistIdx,
			openVim,
			clearTerminal,
			sessionClosedMsg,
		],
	);

	return { processCommand };
}
