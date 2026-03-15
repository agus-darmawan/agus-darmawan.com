import { useCallback } from "react";
import { type FSNode, mkLine, type TermLine } from "@/types/terminal";

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

const HELP_TEXT = `
╔══════════════════════════════════════╗
║         Available Commands           ║
╠══════════════════════════════════════╣
║  ls  [path]    list directory        ║
║  cd  <dir>     change directory      ║
║  pwd           working directory     ║
║  cat <file>    show file             ║
║  touch <file>  create file           ║
║  mkdir <dir>   create directory      ║
║  rm  <file>    remove file           ║
║  echo <text>   print text            ║
║  vim <file>    open vim editor       ║
║  git status/log/branch               ║
║  neofetch      system info           ║
║  cowsay <msg>  talking cow           ║
║  fortune       random quote          ║
║  cal           calendar              ║
║  history       command history       ║
║  clear         clear terminal        ║
║  whoami/date/uname -a/uptime         ║
╚══════════════════════════════════════╝`.trim();

const FORTUNES = [
	'"Talk is cheap. Show me the code." — Linus Torvalds',
	'"First, solve the problem. Then, write the code." — John Johnson',
	'"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
	'"Programs must be written for people to read." — Harold Abelson',
	'"Any fool can write code a computer understands. Good programmers write code humans understand." — M. Fowler',
];

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
				case "help":
					addLines(mkLine("output", HELP_TEXT));
					break;

				case "clear":
					clearTerminal();
					break;

				case "pwd":
					addLines(mkLine("output", cwd.replace("~", "/home/agus")));
					break;

				case "whoami":
					addLines(mkLine("output", "agus"));
					break;

				case "date":
					addLines(mkLine("output", new Date().toString()));
					break;

				case "uname": {
					if (args[0] === "-a") {
						addLines(
							mkLine(
								"output",
								"Linux ubuntu 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux",
							),
						);
					} else {
						addLines(mkLine("output", "Linux"));
					}
					break;
				}

				case "uptime": {
					const h = Math.floor(Math.random() * 24) + 1;
					const m = Math.floor(Math.random() * 60);
					addLines(
						mkLine(
							"output",
							`up ${h}:${String(m).padStart(2, "0")}, 1 user, load average: 0.42, 0.38, 0.35`,
						),
					);
					break;
				}

				case "ls": {
					const target = args[0]
						? args[0].startsWith("~") || args[0].startsWith("/")
							? args[0]
							: `${cwd}/${args[0]}`
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
						if (entries.length > 0) {
							addLines(mkLine("output", entries.join("  ")));
						}
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
					const target = args[0] ?? "~";
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
					const existing = fs[cwd]?.[fname] ?? "";
					openVim(fname, existing);
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

				case "git": {
					const sub = args[0];
					if (sub === "status") {
						addLines(
							mkLine(
								"output",
								"On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged:\n        modified:   src/components/windows/content/TerminalWindow.tsx",
							),
						);
					} else if (sub === "log") {
						addLines(
							mkLine(
								"output",
								"commit a1b2c3d (HEAD -> main)\nAuthor: Agus Darmawan <agus@example.com>\nDate:   Mon Feb 24 10:00:00 2026 +0700\n\n    feat: add modular terminal with vim",
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

				case "neofetch":
					addLines(
						mkLine(
							"output",
							`            .-/+oossssoo+/-.               agus@ubuntu
        \`:+ssssssssssssssssss+:\`           OS: Ubuntu 22.04.3 LTS x86_64
      -+ssssssssssssssssssyyssss+-         Kernel: 5.15.0-91-generic
    .ossssssssssssssssssdMMMNysssso.       Shell: bash 5.1.16
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Terminal: Portfolio Term
  +ssssssssshmydMMMMMMMNddddyssssssss+     CPU: Intel i7-12700K @ 5GHz
                                           Languages: TypeScript Go Python
                                           Frameworks: Next.js React Gin`,
						),
					);
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
						row += isToday
							? `[${String(d).padStart(2)}]`
							: String(d).padStart(3);
						if ((firstDay + d) % 7 === 0 || d === daysInMonth) {
							cal += row + "\n";
							row = "";
						}
					}
					addLines(mkLine("output", cal));
					break;
				}

				case "exit":
					addLines(mkLine("system", sessionClosedMsg));
					break;

				default:
					addLines(
						mkLine(
							"error",
							`${cmd}: command not found. Type 'help' for available commands.`,
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
