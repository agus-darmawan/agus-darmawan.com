"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── File System ────────────────────────────────────────────────────────────
const FILE_SYSTEM: Record<string, Record<string, string>> = {
	"~": {
		".bashrc":
			"# ~/.bashrc\nexport PS1='agus@ubuntu:~$ '\nexport PATH=$PATH:/usr/local/bin\nalias ll='ls -la'\nalias gs='git status'",
		".profile": "# ~/.profile\n[ -f ~/.bashrc ] && . ~/.bashrc",
		"README.md":
			"# Welcome to Agus's Portfolio Terminal\n\nThis is an interactive Ubuntu terminal simulation.\nType `help` to see available commands.\n\n## About\nFull-stack developer passionate about building\nbeautiful and functional web applications.\n\nGitHub: github.com/agus-darmawan",
	},
	"~/projects": {
		"portfolio.md":
			"# Portfolio Website\n\nStack: Next.js 16, TypeScript, Tailwind CSS\nFeatures: Ubuntu-themed UI, Spotify integration, i18n\nStatus: Active development",
		"api-service.md":
			"# REST API Service\n\nStack: Go, PostgreSQL, Redis\nFeatures: JWT auth, rate limiting, caching\nStatus: Production",
	},
	"~/documents": {
		"resume.txt":
			"AGUS DARMAWAN\nFull-Stack Developer\n\nEXPERIENCE\n----------\nSoftware Engineer @ Company X (2022-present)\n - Built microservices with Go and Node.js\n - Led frontend team for 3 major products\n\nSKILLS\n------\nLanguages: TypeScript, Go, Python, Rust\nFrameworks: Next.js, React, Fastify, Gin\nDatabases: PostgreSQL, MongoDB, Redis\nDevOps: Docker, Kubernetes, AWS, GCP",
		"notes.txt":
			"Daily notes and ideas\n\nTODO:\n- Finish portfolio projects section\n- Write blog post about Next.js 16\n- Learn Rust async programming",
	},
	"~/downloads": {},
};

type FSNode = Record<string, Record<string, string>>;

// ─── Vim State ───────────────────────────────────────────────────────────────
interface VimState {
	active: boolean;
	filename: string;
	lines: string[];
	cursorLine: number;
	cursorCol: number;
	mode: "normal" | "insert" | "command" | "visual";
	commandBuffer: string;
	statusMessage: string;
	modified: boolean;
	visualStart: number | null;
}

const defaultVim = (): VimState => ({
	active: false,
	filename: "",
	lines: [""],
	cursorLine: 0,
	cursorCol: 0,
	mode: "normal",
	commandBuffer: "",
	statusMessage: "",
	modified: false,
	visualStart: null,
});

// ─── Terminal Line ────────────────────────────────────────────────────────────
interface TermLine {
	id: number;
	type: "input" | "output" | "error" | "system";
	text: string;
}

let lineId = 0;
const mkLine = (type: TermLine["type"], text: string): TermLine => ({
	id: lineId++,
	type,
	text,
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TerminalWindow() {
	const t = useTranslations("TerminalWindow");

	// Terminal state
	const [lines, setLines] = useState<TermLine[]>([
		mkLine("system", "Ubuntu 22.04.3 LTS — agus@ubuntu — portfolio terminal"),
		mkLine("system", 'Type "help" for available commands.'),
		mkLine("system", ""),
	]);
	const [input, setInput] = useState("");
	const [cwd, setCwd] = useState("~");
	const [history, setHistory] = useState<string[]>([]);
	const [histIdx, setHistIdx] = useState(-1);
	const [fs, setFs] = useState<FSNode>(FILE_SYSTEM);

	// Vim state
	const [vim, setVim] = useState<VimState>(defaultVim());

	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const vimInputRef = useRef<HTMLInputElement>(null);
	const vimState = useRef(vim);

	useEffect(() => {
		vimState.current = vim;
	}, [vim]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [lines, vim]);

	useEffect(() => {
		if (vim.active) {
			vimInputRef.current?.focus();
		} else {
			inputRef.current?.focus();
		}
	}, [vim.active]);

	const addLines = useCallback((...newLines: TermLine[]) => {
		setLines((prev) => [...prev, ...newLines]);
	}, []);

	// ─── Command Processor ──────────────────────────────────────────────────
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
				case "help": {
					const helpText = `
╔══════════════════════════════════════════════════════╗
║              Available Commands                      ║
╠══════════════════════════════════════════════════════╣
║  Navigation                                          ║
║    ls  [path]     — list directory contents          ║
║    cd  <dir>      — change directory                 ║
║    pwd            — print working directory          ║
║    tree           — show directory tree              ║
║                                                      ║
║  File Operations                                     ║
║    cat  <file>    — display file contents            ║
║    touch <file>   — create empty file                ║
║    mkdir <dir>    — create directory                 ║
║    rm    <file>   — remove file                      ║
║    cp   <src> <dst> — copy file                      ║
║    mv   <src> <dst> — move/rename file               ║
║    echo <text>    — print text                       ║
║    echo <txt> > <file> — write to file               ║
║                                                      ║
║  Editor                                              ║
║    vim  <file>    — open vim editor                  ║
║    nano <file>    — alias for vim                    ║
║                                                      ║
║  System                                              ║
║    whoami         — current user                     ║
║    uname -a       — system info                      ║
║    uptime         — system uptime                    ║
║    date           — current date/time                ║
║    ps             — running processes                ║
║    top            — system resources                 ║
║    df             — disk usage                       ║
║    free           — memory usage                     ║
║    env            — environment variables            ║
║    which <cmd>    — find command location            ║
║    man  <cmd>     — manual page                      ║
║                                                      ║
║  Network                                             ║
║    ping  <host>   — ping host                        ║
║    curl  <url>    — fetch URL (simulated)            ║
║    wget  <url>    — download (simulated)             ║
║    ifconfig       — network interfaces               ║
║    netstat        — network connections              ║
║                                                      ║
║  Git                                                 ║
║    git status     — repo status                      ║
║    git log        — commit history                   ║
║    git branch     — list branches                    ║
║    git diff       — show changes                     ║
║                                                      ║
║  Fun                                                 ║
║    neofetch       — system info with art             ║
║    cowsay <msg>   — talking cow                      ║
║    fortune        — random quote                     ║
║    matrix         — matrix rain animation            ║
║    banner <text>  — ASCII banner                     ║
║    cal            — calendar                         ║
║                                                      ║
║  Other                                               ║
║    history        — command history                  ║
║    clear          — clear terminal                   ║
║    exit           — close terminal                   ║
╚══════════════════════════════════════════════════════╝`.trim();
					addLines(mkLine("output", helpText));
					break;
				}

				case "clear":
					setLines([mkLine("system", "")]);
					break;

				case "pwd":
					addLines(mkLine("output", cwd.replace("~", "/home/agus")));
					break;

				case "whoami":
					addLines(mkLine("output", "agus"));
					break;

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
						if (entries.length === 0) {
							// empty dir, show nothing
						} else {
							const long = args.includes("-la") || args.includes("-l");
							if (long) {
								addLines(mkLine("output", "total " + entries.length * 4));
								for (const e of entries) {
									const isDir = e.startsWith(".") ? "." : "-";
									const size = dir[e].length;
									addLines(
										mkLine(
											"output",
											`-rw-r--r-- 1 agus agus ${String(size).padStart(6)} Feb 24 ${e}`,
										),
									);
								}
							} else {
								addLines(mkLine("output", entries.join("  ")));
							}
						}
					}
					// Also show subdirs
					const subdirs = Object.keys(fs).filter(
						(k) =>
							k !== normalTarget &&
							k.startsWith(normalTarget + "/") &&
							!k.slice(normalTarget.length + 1).includes("/"),
					);
					for (const sd of subdirs) {
						const name = sd.split("/").pop()!;
						addLines(mkLine("output", `\x1b[34m${name}/\x1b[0m`));
					}
					break;
				}

				case "cd": {
					const target = args[0] ?? "~";
					let resolved: string;
					if (target === "~" || target === "") {
						resolved = "~";
					} else if (target === "..") {
						const parts2 = cwd.split("/");
						parts2.pop();
						resolved = parts2.join("/") || "~";
					} else if (target.startsWith("~") || target.startsWith("/")) {
						resolved = target.replace("/home/agus", "~");
					} else {
						resolved = `${cwd}/${target}`;
					}

					const isDir =
						fs[resolved] !== undefined ||
						Object.keys(fs).some((k) => k === resolved);
					if (isDir) {
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
					const fname = args[0];
					const dir = fs[cwd];
					if (dir?.[fname] !== undefined) {
						addLines(mkLine("output", dir[fname]));
					} else {
						addLines(
							mkLine("error", `cat: ${fname}: No such file or directory`),
						);
					}
					break;
				}

				case "touch": {
					if (!args[0]) {
						addLines(mkLine("error", "touch: missing file operand"));
						break;
					}
					setFs((prev) => ({
						...prev,
						[cwd]: { ...(prev[cwd] ?? {}), [args[0]]: "" },
					}));
					break;
				}

				case "mkdir": {
					if (!args[0]) {
						addLines(mkLine("error", "mkdir: missing operand"));
						break;
					}
					const newDir = `${cwd}/${args[0]}`;
					setFs((prev) => ({ ...prev, [newDir]: {} }));
					break;
				}

				case "rm": {
					if (!args[0]) {
						addLines(mkLine("error", "rm: missing operand"));
						break;
					}
					const dir = fs[cwd];
					if (dir?.[args[0]] !== undefined) {
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

				case "cp": {
					if (args.length < 2) {
						addLines(mkLine("error", "cp: missing destination file operand"));
						break;
					}
					const src = args[0];
					const dst = args[1];
					const srcDir = fs[cwd];
					if (srcDir?.[src] !== undefined) {
						setFs((prev) => ({
							...prev,
							[cwd]: { ...prev[cwd], [dst]: prev[cwd][src] },
						}));
					} else {
						addLines(
							mkLine("error", `cp: '${src}': No such file or directory`),
						);
					}
					break;
				}

				case "mv": {
					if (args.length < 2) {
						addLines(mkLine("error", "mv: missing destination file operand"));
						break;
					}
					const src = args[0];
					const dst = args[1];
					const srcDir = fs[cwd];
					if (srcDir?.[src] !== undefined) {
						setFs((prev) => {
							const next = {
								...prev,
								[cwd]: { ...prev[cwd], [dst]: prev[cwd][src] },
							};
							delete next[cwd][src];
							return next;
						});
					} else {
						addLines(
							mkLine("error", `mv: '${src}': No such file or directory`),
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

				case "tree": {
					const renderTree = (
						dir: string,
						prefix = "",
						depth = 0,
					): string[] => {
						if (depth > 3) return [];
						const out: string[] = [];
						const entries = Object.keys(fs[dir] ?? {});
						const subdirs = Object.keys(fs).filter(
							(k) =>
								k.startsWith(dir + "/") &&
								!k.slice(dir.length + 1).includes("/"),
						);
						for (const e of entries) {
							out.push(`${prefix}├── ${e}`);
						}
						for (let i = 0; i < subdirs.length; i++) {
							const sd = subdirs[i];
							const isLast = i === subdirs.length - 1;
							out.push(
								`${prefix}${isLast ? "└" : "├"}── ${sd.split("/").pop()}/`,
							);
							out.push(
								...renderTree(
									sd,
									prefix + (isLast ? "    " : "│   "),
									depth + 1,
								),
							);
						}
						return out;
					};
					addLines(mkLine("output", cwd.replace("~", "/home/agus")));
					for (const l of renderTree(cwd)) {
						addLines(mkLine("output", l));
					}
					break;
				}

				case "vim":
				case "nano": {
					const fname2 = args[0];
					if (!fname2) {
						addLines(mkLine("error", `${cmd}: missing filename`));
						break;
					}
					const existing = fs[cwd]?.[fname2] ?? "";
					setVim({
						active: true,
						filename: fname2,
						lines: existing ? existing.split("\n") : [""],
						cursorLine: 0,
						cursorCol: 0,
						mode: "normal",
						commandBuffer: "",
						statusMessage: `"${fname2}" ${existing ? `${existing.split("\n").length}L, ${existing.length}C` : "[New File]"}`,
						modified: false,
						visualStart: null,
					});
					break;
				}

				case "history": {
					history.forEach((h, i) => {
						addLines(
							mkLine(
								"output",
								`  ${String(history.length - i).padStart(3)}  ${h}`,
							),
						);
					});
					break;
				}

				case "date":
					addLines(mkLine("output", new Date().toString()));
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
					let cal = `         ${monthName}\n`;
					cal += days.join(" ") + "\n";
					let row = "";
					for (let i = 0; i < firstDay; i++) row += "   ";
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

				case "uname": {
					const flag = args[0];
					if (flag === "-a") {
						addLines(
							mkLine(
								"output",
								"Linux ubuntu 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux",
							),
						);
					} else {
						addLines(mkLine("output", "Linux"));
					}
					break;
				}

				case "uptime": {
					const h2 = Math.floor(Math.random() * 24) + 1;
					const m2 = Math.floor(Math.random() * 60);
					addLines(
						mkLine(
							"output",
							` ${new Date().toLocaleTimeString()} up ${h2}:${String(m2).padStart(2, "0")}, 1 user, load average: 0.42, 0.38, 0.35`,
						),
					);
					break;
				}

				case "ps":
					addLines(
						mkLine(
							"output",
							"  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 1337 pts/0    00:00:00 node\n 4200 pts/0    00:00:00 ps",
						),
					);
					break;

				case "top":
					addLines(
						mkLine(
							"output",
							`top - ${new Date().toLocaleTimeString()} up 4h, 1 user, load: 0.42
Tasks:  98 total,   1 running,  97 sleeping
%Cpu(s):  4.2 us,  1.3 sy,  0.0 ni, 93.9 id
MiB Mem:   7936.0 total,   1024.3 free,   4200.1 used
MiB Swap:  2048.0 total,   2048.0 free,      0.0 used

  PID USER      PR  NI    VIRT    RES  SHR S  %CPU  %MEM  TIME+     COMMAND
 1337 agus      20   0  842700 120400  48200 S   4.2   1.5   1:23.45  node
  420 agus      20   0   42100  12300   9800 S   0.7   0.2   0:03.12  next-server
    1 root      20   0   22400   7200   5400 S   0.0   0.1   0:01.02  systemd`,
						),
					);
					break;

				case "df":
					addLines(
						mkLine(
							"output",
							`Filesystem      1K-blocks     Used Available Use% Mounted on
/dev/sda1       102685624 42841600  54592000  44% /
tmpfs             8134400        0   8134400   0% /dev/shm
/dev/sda2          524288   102400    421888  20% /boot`,
						),
					);
					break;

				case "free":
					addLines(
						mkLine(
							"output",
							`               total        used        free      shared  buff/cache   available
Mem:         8124800     4302848     1048576      131072     2773376     3473408
Swap:        2097152           0     2097152`,
						),
					);
					break;

				case "env":
					addLines(
						mkLine(
							"output",
							`USER=agus\nHOME=/home/agus\nSHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nLANG=en_US.UTF-8\nTERM=xterm-256color\nEDITOR=vim\nNODE_ENV=development`,
						),
					);
					break;

				case "which": {
					const knownCmds: Record<string, string> = {
						bash: "/bin/bash",
						vim: "/usr/bin/vim",
						node: "/usr/local/bin/node",
						git: "/usr/bin/git",
						python3: "/usr/bin/python3",
						ls: "/bin/ls",
						cat: "/bin/cat",
						grep: "/bin/grep",
					};
					const found = knownCmds[args[0]];
					if (found) addLines(mkLine("output", found));
					else addLines(mkLine("error", `which: no ${args[0]} in PATH`));
					break;
				}

				case "man": {
					const pages: Record<string, string> = {
						ls: "LS(1)\n\nNAME\n  ls - list directory contents\n\nSYNOPSIS\n  ls [OPTION]... [FILE]...\n\nDESCRIPTION\n  List information about the FILEs (the current directory by default).\n\nOPTIONS\n  -l   use a long listing format\n  -a   do not ignore entries starting with .",
						vim: "VIM(1)\n\nNAME\n  vim - Vi IMproved\n\nSYNOPSIS\n  vim [file ...]\n\nDESCRIPTION\n  Vim is a text editor. Press i to enter insert mode,\n  Esc to return to normal, :w to save, :q to quit.",
						git: "GIT(1)\n\nNAME\n  git - the stupid content tracker\n\nCOMMANDS\n  git status   - show working tree status\n  git log      - show commit logs\n  git branch   - list branches\n  git diff     - show changes",
					};
					const page = pages[args[0]];
					if (page) addLines(mkLine("output", page));
					else if (!args[0])
						addLines(mkLine("error", "What manual page do you want?"));
					else addLines(mkLine("error", `No manual entry for ${args[0]}`));
					break;
				}

				case "ping": {
					const host = args[0] ?? "localhost";
					addLines(
						mkLine(
							"output",
							`PING ${host}: 56 data bytes\n64 bytes from ${host}: icmp_seq=0 ttl=64 time=${(Math.random() * 20 + 1).toFixed(3)} ms\n64 bytes from ${host}: icmp_seq=1 ttl=64 time=${(Math.random() * 20 + 1).toFixed(3)} ms\n64 bytes from ${host}: icmp_seq=2 ttl=64 time=${(Math.random() * 20 + 1).toFixed(3)} ms\n\n--- ${host} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss`,
						),
					);
					break;
				}

				case "curl":
				case "wget": {
					const url = args[0];
					if (!url) addLines(mkLine("error", `${cmd}: no URL specified`));
					else
						addLines(
							mkLine(
								"output",
								`  % Total    % Received % Xferd  Average Speed   Time\n100  1337  100  1337    0     0   4200      0  0:00:00 --:--:--  0:00:00  4200\n{"status":"ok","message":"Simulated response from ${url}"}`,
							),
						);
					break;
				}

				case "ifconfig":
					addLines(
						mkLine(
							"output",
							`eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::1  prefixlen 64  scopeid 0x20<link>
        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)
        RX packets 8421  bytes 9841024 (9.3 MiB)
        TX packets 4200  bytes 1337000 (1.2 MiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>`,
						),
					);
					break;

				case "netstat":
					addLines(
						mkLine(
							"output",
							`Active Internet connections
Proto  Local Address          Foreign Address        State
tcp    0.0.0.0:3000           0.0.0.0:*              LISTEN
tcp    127.0.0.1:5432         0.0.0.0:*              LISTEN
tcp    127.0.0.1:6379         0.0.0.0:*              LISTEN
tcp    192.168.1.42:52834     142.250.80.46:443      ESTABLISHED`,
						),
					);
					break;

				case "git": {
					const sub = args[0];
					if (sub === "status") {
						addLines(
							mkLine(
								"output",
								`On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   src/components/windows/content/TerminalWindow.tsx

Untracked files:
        .env.local

nothing added to commit but untracked files present`,
							),
						);
					} else if (sub === "log") {
						addLines(
							mkLine(
								"output",
								`commit a1b2c3d4e5f6 (HEAD -> main, origin/main)
Author: Agus Darmawan <agus@example.com>
Date:   Mon Feb 24 10:00:00 2026 +0700

    feat: add full-featured terminal with vim support

commit b2c3d4e5f6a1
Author: Agus Darmawan <agus@example.com>
Date:   Sun Feb 23 15:30:00 2026 +0700

    feat: add Spotify now playing integration

commit c3d4e5f6a1b2
Author: Agus Darmawan <agus@example.com>
Date:   Sat Feb 22 09:00:00 2026 +0700

    init: Ubuntu portfolio theme`,
							),
						);
					} else if (sub === "branch") {
						addLines(
							mkLine("output", "* main\n  develop\n  feature/terminal-vim"),
						);
					} else if (sub === "diff") {
						addLines(
							mkLine(
								"output",
								`diff --git a/src/components/windows/content/TerminalWindow.tsx b/...
--- a/TerminalWindow.tsx
+++ b/TerminalWindow.tsx
@@ -1,7 +1,320 @@
-// old terminal
+// new terminal with vim support`,
							),
						);
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

				case "neofetch": {
					addLines(
						mkLine(
							"output",
							`            .-/+oossssoo+/-.               agus@ubuntu
        \`:+ssssssssssssssssss+:\`           ---------
      -+ssssssssssssssssssyyssss+-         OS: Ubuntu 22.04.3 LTS x86_64
    .ossssssssssssssssssdMMMNysssso.       Host: Portfolio VM 1.0
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: 5.15.0-91-generic
  +ssssssssshmydMMMMMMMNddddyssssssss+     Shell: bash 5.1.16
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Resolution: 1920x1080
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   DE: Ubuntu Desktop
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   WM: Mutter (GNOME Shell)
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Terminal: Portfolio Term
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   CPU: Intel i7-12700K @ 5GHz
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   GPU: NVIDIA RTX 3080
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Memory: 4302MiB / 7940MiB
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    
  +ssssssssshmydMMMMMMMNddddyssssssss+     Languages: TypeScript Go Python
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Frameworks: Next.js React Gin
    .ossssssssssssssssssdMMMNysssso.       
      -+ssssssssssssssssssyyssss+-         
        \`:+ssssssssssssssssss+:\`           
            .-/+oossssoo+/-.               `,
						),
					);
					break;
				}

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

				case "fortune": {
					const quotes = [
						'"The best way to predict the future is to invent it." — Alan Kay',
						'"Talk is cheap. Show me the code." — Linus Torvalds',
						'"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
						'"First, solve the problem. Then, write the code." — John Johnson',
						'"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
						'"Programs must be written for people to read, and only incidentally for machines to execute." — Harold Abelson',
						'"The most disastrous thing that you can ever learn is your first programming language." — Alan Kay',
					];
					addLines(
						mkLine("output", quotes[Math.floor(Math.random() * quotes.length)]),
					);
					break;
				}

				case "banner": {
					const text = (args[0] ?? "HELLO").toUpperCase().slice(0, 6);
					const bannerChars: Record<string, string[]> = {
						A: ["  #  ", " # # ", "#####", "#   #", "#   #"],
						B: ["#### ", "#   #", "#### ", "#   #", "#### "],
						C: [" ####", "#    ", "#    ", "#    ", " ####"],
						D: ["#### ", "#   #", "#   #", "#   #", "#### "],
						E: ["#####", "#    ", "### ", "#    ", "#####"],
						F: ["#####", "#    ", "### ", "#    ", "#    "],
						G: [" ####", "#    ", "# ###", "#   #", " ####"],
						H: ["#   #", "#   #", "#####", "#   #", "#   #"],
						I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
						J: ["#####", "  #  ", "  #  ", "#  #", " ## "],
						K: ["#  # ", "# #  ", "##   ", "# #  ", "#  # "],
						L: ["#    ", "#    ", "#    ", "#    ", "#####"],
						M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
						N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
						O: [" ### ", "#   #", "#   #", "#   #", " ### "],
						P: ["#### ", "#   #", "#### ", "#    ", "#    "],
						R: ["#### ", "#   #", "#### ", "# #  ", "#  ##"],
						S: [" ####", "#    ", " ### ", "    #", "#### "],
						T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
						U: ["#   #", "#   #", "#   #", "#   #", " ### "],
						W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
						X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
						Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
						Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
					};
					const rows: string[] = ["", "", "", "", ""];
					for (const ch of text.slice(0, 6)) {
						const glyph = bannerChars[ch] ?? [
							"?????",
							"?   ?",
							"? ? ?",
							"?   ?",
							"?????",
						];
						for (let r = 0; r < 5; r++) {
							rows[r] += (glyph[r] ?? "     ") + "  ";
						}
					}
					addLines(mkLine("output", rows.join("\n")));
					break;
				}

				case "matrix": {
					const cols = 60;
					const out: string[] = [];
					for (let r = 0; r < 10; r++) {
						let row = "";
						for (let c = 0; c < cols; c++) {
							const ch =
								Math.random() > 0.7
									? String.fromCharCode(
											Math.random() > 0.5
												? 0x30a0 + Math.floor(Math.random() * 96)
												: 48 + Math.floor(Math.random() * 10),
										)
									: " ";
							row += ch;
						}
						out.push(row);
					}
					addLines(mkLine("output", out.join("\n")));
					break;
				}

				case "exit":
					addLines(mkLine("system", "Session closed. Goodbye!"));
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
		[cwd, fs, history, addLines],
	);

	// ─── Input Key Handler ───────────────────────────────────────────────────
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				processCommand(input);
				setInput("");
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setHistIdx((i) => {
					const ni = Math.min(i + 1, history.length - 1);
					setInput(history[ni] ?? "");
					return ni;
				});
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setHistIdx((i) => {
					const ni = Math.max(i - 1, -1);
					setInput(ni === -1 ? "" : (history[ni] ?? ""));
					return ni;
				});
			} else if (e.key === "Tab") {
				e.preventDefault();
				// basic autocomplete
				const partial = input.split(" ").pop() ?? "";
				const dir = fs[cwd] ?? {};
				const matches = Object.keys(dir).filter((k) => k.startsWith(partial));
				if (matches.length === 1) {
					const parts2 = input.split(" ");
					parts2[parts2.length - 1] = matches[0];
					setInput(parts2.join(" "));
				} else if (matches.length > 1) {
					addLines(mkLine("output", matches.join("  ")));
				}
			} else if (e.key === "l" && e.ctrlKey) {
				e.preventDefault();
				setLines([mkLine("system", "")]);
			} else if (e.key === "c" && e.ctrlKey) {
				e.preventDefault();
				addLines(mkLine("input", `agus@ubuntu:${cwd}$ ${input}^C`));
				setInput("");
			}
		},
		[input, history, cwd, fs, processCommand, addLines],
	);

	// ─── VIM KEY HANDLER ─────────────────────────────────────────────────────
	const handleVimKey = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			e.preventDefault();
			const v = vimState.current;

			if (v.mode === "insert") {
				if (e.key === "Escape") {
					setVim((prev) => ({
						...prev,
						mode: "normal",
						statusMessage: "",
						cursorCol: Math.max(0, prev.cursorCol - 1),
					}));
				} else if (e.key === "Enter") {
					setVim((prev) => {
						const newLines = [...prev.lines];
						const before = newLines[prev.cursorLine].slice(0, prev.cursorCol);
						const after = newLines[prev.cursorLine].slice(prev.cursorCol);
						newLines[prev.cursorLine] = before;
						newLines.splice(prev.cursorLine + 1, 0, after);
						return {
							...prev,
							lines: newLines,
							cursorLine: prev.cursorLine + 1,
							cursorCol: 0,
							modified: true,
						};
					});
				} else if (e.key === "Backspace") {
					setVim((prev) => {
						const newLines = [...prev.lines];
						if (prev.cursorCol > 0) {
							newLines[prev.cursorLine] =
								newLines[prev.cursorLine].slice(0, prev.cursorCol - 1) +
								newLines[prev.cursorLine].slice(prev.cursorCol);
							return {
								...prev,
								lines: newLines,
								cursorCol: prev.cursorCol - 1,
								modified: true,
							};
						} else if (prev.cursorLine > 0) {
							const prevLen = newLines[prev.cursorLine - 1].length;
							newLines[prev.cursorLine - 1] += newLines[prev.cursorLine];
							newLines.splice(prev.cursorLine, 1);
							return {
								...prev,
								lines: newLines,
								cursorLine: prev.cursorLine - 1,
								cursorCol: prevLen,
								modified: true,
							};
						}
						return prev;
					});
				} else if (e.key.length === 1) {
					setVim((prev) => {
						const newLines = [...prev.lines];
						const line = newLines[prev.cursorLine] ?? "";
						newLines[prev.cursorLine] =
							line.slice(0, prev.cursorCol) +
							e.key +
							line.slice(prev.cursorCol);
						return {
							...prev,
							lines: newLines,
							cursorCol: prev.cursorCol + 1,
							modified: true,
						};
					});
				}
				return;
			}

			if (v.mode === "command") {
				if (e.key === "Escape") {
					setVim((prev) => ({
						...prev,
						mode: "normal",
						commandBuffer: "",
						statusMessage: "",
					}));
				} else if (e.key === "Enter") {
					const cmd2 = v.commandBuffer.slice(1);
					// Process vim commands
					if (cmd2 === "w" || cmd2 === "wq" || cmd2 === "x") {
						const content = v.lines.join("\n");
						setFs((prev) => ({
							...prev,
							[cwd]: { ...(prev[cwd] ?? {}), [v.filename]: content },
						}));
						const lc = v.lines.length;
						const cc = content.length;
						if (cmd2 === "wq" || cmd2 === "x") {
							setVim(defaultVim());
							addLines(
								mkLine("output", `"${v.filename}" ${lc}L, ${cc}C written`),
							);
						} else {
							setVim((prev) => ({
								...prev,
								mode: "normal",
								commandBuffer: "",
								statusMessage: `"${v.filename}" ${lc}L, ${cc}C written`,
								modified: false,
							}));
						}
					} else if (cmd2 === "q!" || cmd2 === "q") {
						if (cmd2 === "q" && v.modified) {
							setVim((prev) => ({
								...prev,
								mode: "normal",
								commandBuffer: "",
								statusMessage:
									"E37: No write since last change (add ! to override)",
							}));
						} else {
							setVim(defaultVim());
						}
					} else if (cmd2.match(/^\d+$/)) {
						const lineNum = Math.min(parseInt(cmd2) - 1, v.lines.length - 1);
						setVim((prev) => ({
							...prev,
							mode: "normal",
							commandBuffer: "",
							cursorLine: Math.max(0, lineNum),
							cursorCol: 0,
							statusMessage: "",
						}));
					} else if (cmd2.startsWith("s/")) {
						// :s/old/new/ substitution
						const parts2 = cmd2.split("/");
						if (parts2.length >= 3) {
							const [, old, newStr] = parts2;
							setVim((prev) => {
								const newLines = [...prev.lines];
								newLines[prev.cursorLine] = newLines[prev.cursorLine].replace(
									old,
									newStr ?? "",
								);
								return {
									...prev,
									lines: newLines,
									mode: "normal",
									commandBuffer: "",
									statusMessage: `Substitution done`,
									modified: true,
								};
							});
						}
					} else if (cmd2 === "set nu" || cmd2 === "set number") {
						setVim((prev) => ({
							...prev,
							mode: "normal",
							commandBuffer: "",
							statusMessage: "Line numbers enabled",
						}));
					} else if (cmd2 === "noh" || cmd2 === "nohlsearch") {
						setVim((prev) => ({
							...prev,
							mode: "normal",
							commandBuffer: "",
							statusMessage: "",
						}));
					} else {
						setVim((prev) => ({
							...prev,
							mode: "normal",
							commandBuffer: "",
							statusMessage: `E492: Not an editor command: ${cmd2}`,
						}));
					}
				} else if (e.key === "Backspace") {
					setVim((prev) => ({
						...prev,
						commandBuffer: prev.commandBuffer.slice(0, -1),
					}));
				} else if (e.key.length === 1) {
					setVim((prev) => ({
						...prev,
						commandBuffer: prev.commandBuffer + e.key,
					}));
				}
				return;
			}

			// Normal mode
			switch (e.key) {
				case "i":
					setVim((prev) => ({
						...prev,
						mode: "insert",
						statusMessage: "-- INSERT --",
					}));
					break;
				case "I":
					setVim((prev) => ({
						...prev,
						mode: "insert",
						cursorCol: 0,
						statusMessage: "-- INSERT --",
					}));
					break;
				case "a":
					setVim((prev) => ({
						...prev,
						mode: "insert",
						cursorCol: Math.min(
							prev.cursorCol + 1,
							prev.lines[prev.cursorLine]?.length ?? 0,
						),
						statusMessage: "-- INSERT --",
					}));
					break;
				case "A":
					setVim((prev) => ({
						...prev,
						mode: "insert",
						cursorCol: prev.lines[prev.cursorLine]?.length ?? 0,
						statusMessage: "-- INSERT --",
					}));
					break;
				case "o":
					setVim((prev) => {
						const newLines = [...prev.lines];
						newLines.splice(prev.cursorLine + 1, 0, "");
						return {
							...prev,
							lines: newLines,
							cursorLine: prev.cursorLine + 1,
							cursorCol: 0,
							mode: "insert",
							statusMessage: "-- INSERT --",
							modified: true,
						};
					});
					break;
				case "O":
					setVim((prev) => {
						const newLines = [...prev.lines];
						newLines.splice(prev.cursorLine, 0, "");
						return {
							...prev,
							lines: newLines,
							cursorCol: 0,
							mode: "insert",
							statusMessage: "-- INSERT --",
							modified: true,
						};
					});
					break;
				case "h":
				case "ArrowLeft":
					setVim((prev) => ({
						...prev,
						cursorCol: Math.max(0, prev.cursorCol - 1),
					}));
					break;
				case "l":
				case "ArrowRight":
					setVim((prev) => ({
						...prev,
						cursorCol: Math.min(
							prev.cursorCol + 1,
							(prev.lines[prev.cursorLine]?.length ?? 1) - 1,
						),
					}));
					break;
				case "j":
				case "ArrowDown":
					setVim((prev) => ({
						...prev,
						cursorLine: Math.min(prev.cursorLine + 1, prev.lines.length - 1),
					}));
					break;
				case "k":
				case "ArrowUp":
					setVim((prev) => ({
						...prev,
						cursorLine: Math.max(prev.cursorLine - 1, 0),
					}));
					break;
				case "0":
					setVim((prev) => ({ ...prev, cursorCol: 0 }));
					break;
				case "$":
					setVim((prev) => ({
						...prev,
						cursorCol: Math.max(
							0,
							(prev.lines[prev.cursorLine]?.length ?? 1) - 1,
						),
					}));
					break;
				case "g":
					// gg — go to first line (simplified, handle as immediate)
					setVim((prev) => ({ ...prev, cursorLine: 0, cursorCol: 0 }));
					break;
				case "G":
					setVim((prev) => ({
						...prev,
						cursorLine: prev.lines.length - 1,
						cursorCol: 0,
					}));
					break;
				case "w": {
					// word forward
					setVim((prev) => {
						const line = prev.lines[prev.cursorLine] ?? "";
						let col = prev.cursorCol + 1;
						while (col < line.length && line[col] !== " ") col++;
						while (col < line.length && line[col] === " ") col++;
						return { ...prev, cursorCol: Math.min(col, line.length - 1) };
					});
					break;
				}
				case "b": {
					// word backward
					setVim((prev) => {
						const line = prev.lines[prev.cursorLine] ?? "";
						let col = prev.cursorCol - 1;
						while (col > 0 && line[col] === " ") col--;
						while (col > 0 && line[col - 1] !== " ") col--;
						return { ...prev, cursorCol: Math.max(0, col) };
					});
					break;
				}
				case "x":
					// delete char under cursor
					setVim((prev) => {
						const newLines = [...prev.lines];
						const line = newLines[prev.cursorLine];
						newLines[prev.cursorLine] =
							line.slice(0, prev.cursorCol) + line.slice(prev.cursorCol + 1);
						return { ...prev, lines: newLines, modified: true };
					});
					break;
				case "d":
					if (e.shiftKey) {
						// D — delete to end of line
						setVim((prev) => {
							const newLines = [...prev.lines];
							newLines[prev.cursorLine] = newLines[prev.cursorLine].slice(
								0,
								prev.cursorCol,
							);
							return { ...prev, lines: newLines, modified: true };
						});
					}
					break;
				case ":":
					setVim((prev) => ({
						...prev,
						mode: "command",
						commandBuffer: ":",
						statusMessage: "",
					}));
					break;
				case "u":
					setVim((prev) => ({
						...prev,
						statusMessage: "Already at oldest change",
					}));
					break;
				case "Escape":
					setVim((prev) => ({ ...prev, statusMessage: "" }));
					break;
			}
		},
		[cwd, addLines],
	);

	// ─── Vim Renderer ────────────────────────────────────────────────────────
	if (vim.active) {
		const VISIBLE = 20;
		const start = Math.max(
			0,
			Math.min(
				vim.cursorLine - Math.floor(VISIBLE / 2),
				vim.lines.length - VISIBLE,
			),
		);
		const visibleLines = vim.lines.slice(start, start + VISIBLE);

		return (
			<div
				className="h-full flex flex-col font-mono text-sm"
				style={{ background: "#1a1a2e", color: "#e0e0e0" }}
				onClick={() => vimInputRef.current?.focus()}
			>
				{/* Hidden input capture */}
				<input
					ref={vimInputRef}
					onKeyDown={handleVimKey}
					className="absolute opacity-0 w-0 h-0"
					readOnly
					aria-label="vim input"
				/>

				{/* Title bar */}
				<div
					className="px-3 py-1 text-xs flex justify-between shrink-0"
					style={{
						background: "#16213e",
						borderBottom: "1px solid #0f3460",
						color: "#a0a0c0",
					}}
				>
					<span>
						VIM — {vim.filename}
						{vim.modified ? " [+]" : ""}
					</span>
					<span style={{ color: "#e94560" }}>
						{vim.mode === "insert"
							? "INSERT"
							: vim.mode === "command"
								? "COMMAND"
								: vim.mode === "visual"
									? "VISUAL"
									: "NORMAL"}
					</span>
				</div>

				{/* Editor area */}
				<div className="flex-1 overflow-hidden flex flex-col">
					{visibleLines.map((line, idx) => {
						const absLine = start + idx;
						const isCursorLine = absLine === vim.cursorLine;

						return (
							<div
								key={absLine}
								className="flex min-h-5"
								style={{
									background: isCursorLine
										? "rgba(255,255,255,0.05)"
										: "transparent",
								}}
							>
								{/* Line number */}
								<span
									className="w-10 shrink-0 text-right pr-3 select-none text-xs"
									style={{
										color: isCursorLine ? "#e94560" : "#404060",
										lineHeight: "1.4",
									}}
								>
									{absLine + 1}
								</span>

								{/* Line content */}
								<span
									className="flex-1 whitespace-pre"
									style={{ lineHeight: "1.4" }}
								>
									{isCursorLine ? (
										<>
											<span>{line.slice(0, vim.cursorCol)}</span>
											<span
												style={{
													background:
														vim.mode === "insert" ? "#e94560" : "#00d4ff",
													color: "#1a1a2e",
													animation: "blink 1s step-start infinite",
												}}
											>
												{line[vim.cursorCol] ?? " "}
											</span>
											<span>{line.slice(vim.cursorCol + 1)}</span>
										</>
									) : (
										line || "\u00a0"
									)}
								</span>
							</div>
						);
					})}

					{/* Tilde lines for empty buffer space */}
					{Array.from({
						length: Math.max(0, VISIBLE - visibleLines.length),
					}).map((_, i) => (
						<div key={`tilde-${i}`} className="flex min-h-5">
							<span
								className="w-10 shrink-0 text-right pr-3 text-xs select-none"
								style={{ color: "#404060", lineHeight: "1.4" }}
							>
								~
							</span>
						</div>
					))}
				</div>

				{/* Status bar */}
				<div
					className="px-3 py-1 text-xs flex justify-between shrink-0"
					style={{
						background: vim.mode === "insert" ? "#e94560" : "#0f3460",
						color: vim.mode === "insert" ? "#1a1a2e" : "#e0e0e0",
					}}
				>
					<span>
						{vim.mode === "command" ? vim.commandBuffer : vim.statusMessage}
					</span>
					<span>
						{vim.cursorLine + 1},{vim.cursorCol + 1}
						{vim.mode === "normal" && "  All"}
					</span>
				</div>

				{/* Cheat sheet */}
				<div
					className="px-3 py-1 text-xs shrink-0 flex gap-4 flex-wrap"
					style={{
						background: "#0a0a1a",
						color: "#505070",
						borderTop: "1px solid #1a1a3e",
					}}
				>
					<span>
						<span style={{ color: "#00d4ff" }}>i</span>=insert{" "}
						<span style={{ color: "#00d4ff" }}>Esc</span>=normal{" "}
						<span style={{ color: "#00d4ff" }}>:w</span>=save{" "}
						<span style={{ color: "#00d4ff" }}>:q!</span>=quit{" "}
						<span style={{ color: "#00d4ff" }}>:wq</span>=save&amp;quit{" "}
						<span style={{ color: "#00d4ff" }}>hjkl</span>=move
					</span>
				</div>

				<style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
			</div>
		);
	}

	// ─── Terminal Renderer ───────────────────────────────────────────────────
	return (
		<div
			className="h-full flex flex-col font-mono text-sm"
			style={{ background: "#0e0e0e", color: "#c8c8c8" }}
			onClick={() => inputRef.current?.focus()}
		>
			{/* Output area */}
			<div className="flex-1 overflow-y-auto p-3 space-y-0.5">
				{lines.map((line) => (
					<div
						key={line.id}
						className="whitespace-pre-wrap leading-5 break-all"
						style={{
							color:
								line.type === "error"
									? "#ff5555"
									: line.type === "system"
										? "#666"
										: line.type === "input"
											? "#50fa7b"
											: "#c8c8c8",
							fontSize: "0.8rem",
						}}
					>
						{line.text}
					</div>
				))}

				{/* Current input line */}
				<div className="flex items-center gap-0" style={{ lineHeight: "1.4" }}>
					<span style={{ color: "#50fa7b", fontSize: "0.8rem" }}>
						agus@ubuntu:
					</span>
					<span style={{ color: "#8be9fd", fontSize: "0.8rem" }}>{cwd}</span>
					<span style={{ color: "#c8c8c8", fontSize: "0.8rem" }}>$ </span>
					<input
						ref={inputRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						className="flex-1 bg-transparent outline-none border-none caret-green-400"
						style={{
							color: "#f8f8f2",
							fontSize: "0.8rem",
							caretColor: "#50fa7b",
						}}
						autoFocus
						spellCheck={false}
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
					/>
				</div>
				<div ref={bottomRef} />
			</div>

			{/* Bottom hint bar */}
			<div
				className="px-3 py-1 text-xs shrink-0 flex gap-4"
				style={{
					borderTop: "1px solid #1e1e1e",
					color: "#444",
					background: "#080808",
				}}
			>
				<span>
					<span style={{ color: "#8be9fd" }}>Tab</span>=autocomplete{" "}
					<span style={{ color: "#8be9fd" }}>↑↓</span>=history{" "}
					<span style={{ color: "#8be9fd" }}>Ctrl+L</span>=clear{" "}
					<span style={{ color: "#8be9fd" }}>Ctrl+C</span>=cancel
				</span>
			</div>
		</div>
	);
}
