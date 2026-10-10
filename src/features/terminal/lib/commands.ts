import { APP_IDS, type AppId, isAppId } from "@/config/apps";
import { isLocale, type Locale } from "@/i18n/routing";
import {
	MAN_PAGE,
	NEOFETCH_OUTPUT,
	RM_RF_RESPONSE,
	SUDO_RESPONSES,
} from "../terminal.easter-eggs";
import {
	isDir,
	readFile,
	removeDir,
	removeFile,
	resolvePath,
	splitPath,
	subdirs,
	toAbsolute,
	writeFile,
} from "./fs";
import { mkLine, USER } from "./lines";
import type { FileSystem, TermLine } from "./types";

/** Side effects the terminal UI applies after a command (outside this module). */
export type Effect =
	| { type: "clear" }
	| { type: "exit" }
	| { type: "uptime" }
	| { type: "open"; app: AppId }
	| { type: "close"; app?: AppId }
	| { type: "theme"; mode: "dark" | "light" }
	| { type: "lang"; locale: Locale }
	| { type: "vim"; dir: string; filename: string; content: string };

export interface Context {
	cwd: string;
	fs: FileSystem;
	/** Newest first. */
	history: string[];
	random?: () => number;
	now?: Date;
}

export interface Result {
	lines: TermLine[];
	cwd?: string;
	fs?: FileSystem;
	effect?: Effect;
}

interface Command {
	usage: string;
	description: string;
	/** What Tab completes for the arguments. */
	complete?: "files" | "dirs" | "paths" | "apps";
	run: (args: string[], ctx: Required<Context>, raw: string) => Result;
}

const out = (text: string): Result => ({ lines: [mkLine("output", text)] });
const err = (text: string): Result => ({ lines: [mkLine("error", text)] });
const pick = <T>(items: readonly T[], random: () => number) =>
	items[Math.floor(random() * items.length)];

const FORTUNES = [
	'"Talk is cheap. Show me the code." — Linus Torvalds',
	'"First, solve the problem. Then, write the code." — John Johnson',
	'"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
	'"Programs must be written for people to read." — Harold Abelson',
	'"Any fool can write code a computer understands. Good programmers write code humans understand." — M. Fowler',
	'"The best error message is the one that never shows up." — Thomas Fuchs',
	'"Fix the cause, not the symptom." — Steve Maguire',
];

function cowsay(message: string) {
	const border = "-".repeat(message.length + 2);
	return [
		` ${"_".repeat(message.length + 2)}`,
		`< ${message} >`,
		` ${border}`,
		"        \\   ^__^",
		"         \\  (oo)\\_______",
		"            (__)\\       )\\/\\",
		"                ||----w |",
		"                ||     ||",
	].join("\n");
}

/** Month grid with 4-character cells so `[dd]` (today) never breaks alignment. */
export function calendar(now: Date) {
	const year = now.getFullYear();
	const month = now.getMonth();
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const title = now.toLocaleString("en-US", { month: "long", year: "numeric" });

	const cells = [
		...Array<string>(firstDay).fill("    "),
		...Array.from({ length: daysInMonth }, (_, i) => {
			const day = String(i + 1).padStart(2);
			return i + 1 === now.getDate() ? `[${day}]` : ` ${day} `;
		}),
	];
	const weeks: string[] = [];
	for (let i = 0; i < cells.length; i += 7) {
		weeks.push(
			cells
				.slice(i, i + 7)
				.join("")
				.trimEnd(),
		);
	}

	const width = 28;
	const pad = Math.max(0, Math.floor((width - title.length) / 2));
	const header = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
		.map((d) => ` ${d} `)
		.join("")
		.trimEnd();
	return [`${" ".repeat(pad)}${title}`, header, ...weeks].join("\n");
}

function ls(args: string[], { cwd, fs }: Required<Context>): Result {
	const showHidden = args.some((a) => a.startsWith("-") && a.includes("a"));
	const target = args.find((a) => !a.startsWith("-"));
	const path = resolvePath(cwd, target ?? cwd);

	if (!isDir(fs, path)) {
		const { dir, name } = splitPath(cwd, target ?? "");
		if (target && readFile(fs, dir, name) !== undefined) return out(target);
		return err(`ls: cannot access '${target}': No such file or directory`);
	}

	const entries = [
		...Object.keys(fs[path]),
		...subdirs(fs, path).map((d) => `${d}/`),
	]
		.filter((name) => showHidden || !name.startsWith("."))
		.sort((a, b) => a.localeCompare(b));
	return entries.length ? out(entries.join("  ")) : { lines: [] };
}

function rm(args: string[], { cwd, fs }: Required<Context>): Result {
	const flags = args.filter((a) => a.startsWith("-")).join("");
	const targets = args.filter((a) => !a.startsWith("-"));
	const recursive = /[rR]/.test(flags);

	if (recursive && targets.some((t) => ["/", "~", "/home/agus"].includes(t))) {
		return err(RM_RF_RESPONSE);
	}
	if (targets.length === 0) return err("rm: missing operand");

	let next = fs;
	const lines: TermLine[] = [];
	for (const target of targets) {
		const { dir, name, full } = splitPath(cwd, target);
		if (isDir(next, full)) {
			if (recursive) next = removeDir(next, full);
			else
				lines.push(
					mkLine("error", `rm: cannot remove '${target}': Is a directory`),
				);
		} else if (readFile(next, dir, name) !== undefined) {
			next = removeFile(next, dir, name);
		} else if (!/f/.test(flags)) {
			lines.push(
				mkLine(
					"error",
					`rm: cannot remove '${target}': No such file or directory`,
				),
			);
		}
	}
	return { lines, fs: next };
}

/** `echo text`, `echo text > file`, `echo text >> file`. */
function echo(raw: string, { cwd, fs }: Required<Context>): Result {
	const body = raw.replace(/^\s*echo\s?/, "");
	const match = body.match(/^(.*?)\s*(>>?)\s*(\S+)\s*$/);
	const unquote = (s: string) => s.trim().replace(/^(['"])(.*)\1$/, "$2");

	if (!match) return out(unquote(body));

	const [, text, op, target] = match;
	const { dir, name, full } = splitPath(cwd, target);
	if (!isDir(fs, dir)) return err(`bash: ${target}: No such file or directory`);
	if (isDir(fs, full)) return err(`bash: ${target}: Is a directory`);

	const previous = readFile(fs, dir, name);
	const content =
		op === ">>" && previous ? `${previous}\n${unquote(text)}` : unquote(text);
	return { lines: [], fs: writeFile(fs, dir, name, content) };
}

const GIT: Record<string, string> = {
	status:
		"On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean",
	log: "commit a1b2c3d (HEAD -> main)\nAuthor: Agus Darmawan <darmawandeveloper@gmail.com>\n\n    feat: add modular terminal with vim and easter eggs",
	branch: "* main\n  develop",
};

const COMMANDS: Record<string, Command> = {
	help: {
		usage: "help",
		description: "list available commands",
		run: () => out(helpText()),
	},
	ls: {
		usage: "ls [-a] [path]",
		description: "list directory contents",
		complete: "paths",
		run: ls,
	},
	ll: {
		usage: "ll [path]",
		description: "alias for ls -la",
		complete: "paths",
		run: (args, ctx) => ls(["-la", ...args], ctx),
	},
	cd: {
		usage: "cd [dir]",
		description: "change directory",
		complete: "dirs",
		run: ([target = "~"], { cwd, fs }) => {
			const path = resolvePath(cwd, target);
			if (isDir(fs, path)) return { lines: [], cwd: path };
			const { dir, name } = splitPath(cwd, target);
			return readFile(fs, dir, name) !== undefined
				? err(`cd: ${target}: Not a directory`)
				: err(`cd: ${target}: No such file or directory`);
		},
	},
	pwd: {
		usage: "pwd",
		description: "print working directory",
		run: (_, { cwd }) => out(toAbsolute(cwd)),
	},
	cat: {
		usage: "cat <file>",
		description: "print file contents",
		complete: "files",
		run: (args, { cwd, fs }) => {
			if (args.length === 0) return err("cat: missing operand");
			const lines = args.map((target) => {
				const { dir, name, full } = splitPath(cwd, target);
				if (isDir(fs, full))
					return mkLine("error", `cat: ${target}: Is a directory`);
				const content = readFile(fs, dir, name);
				return content === undefined
					? mkLine("error", `cat: ${target}: No such file or directory`)
					: mkLine("output", content);
			});
			return { lines };
		},
	},
	touch: {
		usage: "touch <file>",
		description: "create an empty file",
		complete: "files",
		run: (args, { cwd, fs }) => {
			if (args.length === 0) return err("touch: missing file operand");
			let next = fs;
			const lines: TermLine[] = [];
			for (const target of args) {
				const { dir, name, full } = splitPath(cwd, target);
				if (!isDir(next, dir)) {
					lines.push(
						mkLine(
							"error",
							`touch: cannot touch '${target}': No such file or directory`,
						),
					);
				} else if (
					!isDir(next, full) &&
					readFile(next, dir, name) === undefined
				) {
					// Existing files keep their contents — touch used to wipe them.
					next = writeFile(next, dir, name, "");
				}
			}
			return { lines, fs: next };
		},
	},
	mkdir: {
		usage: "mkdir <dir>",
		description: "create a directory",
		complete: "dirs",
		run: (args, { cwd, fs }) => {
			if (args.length === 0) return err("mkdir: missing operand");
			let next = fs;
			const lines: TermLine[] = [];
			for (const target of args) {
				const { dir, name, full } = splitPath(cwd, target);
				if (isDir(next, full) || readFile(next, dir, name) !== undefined) {
					lines.push(
						mkLine(
							"error",
							`mkdir: cannot create directory '${target}': File exists`,
						),
					);
				} else if (!isDir(next, dir)) {
					lines.push(
						mkLine(
							"error",
							`mkdir: cannot create directory '${target}': No such file or directory`,
						),
					);
				} else {
					next = { ...next, [full]: {} };
				}
			}
			return { lines, fs: next };
		},
	},
	rm: {
		usage: "rm [-r] <path>",
		description: "remove files or directories",
		complete: "paths",
		run: rm,
	},
	echo: {
		usage: "echo <text> [> file]",
		description: "print text or write it to a file",
		complete: "files",
		run: (_, ctx, raw) => echo(raw, ctx),
	},
	vim: {
		usage: "vim <file>",
		description: "edit a file (also: nano)",
		complete: "files",
		run: ([target], { cwd, fs }) => {
			if (!target) return err("vim: missing filename");
			const { dir, name, full } = splitPath(cwd, target);
			if (isDir(fs, full)) return err(`vim: ${target}: Is a directory`);
			if (!isDir(fs, dir))
				return err(`vim: ${target}: No such file or directory`);
			return {
				lines: [],
				effect: {
					type: "vim",
					dir,
					filename: name,
					content: readFile(fs, dir, name) ?? "",
				},
			};
		},
	},
	history: {
		usage: "history",
		description: "show command history",
		run: (_, { history }) =>
			out(
				[...history]
					.reverse()
					.map((cmd, i) => `${String(i + 1).padStart(5)}  ${cmd}`)
					.join("\n"),
			),
	},
	clear: {
		usage: "clear",
		description: "clear the screen (Ctrl+L)",
		run: () => ({ lines: [], effect: { type: "clear" } }),
	},
	whoami: {
		usage: "whoami",
		description: "print user name",
		run: () => out(USER),
	},
	date: {
		usage: "date",
		description: "print the date",
		run: (_, { now }) => out(now.toString()),
	},
	uname: {
		usage: "uname [-a]",
		description: "print system information",
		run: ([flag]) =>
			out(
				flag === "-a"
					? "Linux ubuntu 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux"
					: "Linux",
			),
	},
	uptime: {
		usage: "uptime",
		description: "uptime and visitors",
		run: () => ({ lines: [], effect: { type: "uptime" } }),
	},
	git: {
		usage: "git <status|log|branch>",
		description: "pretend version control",
		run: ([sub]) =>
			sub && Object.hasOwn(GIT, sub)
				? out(GIT[sub])
				: err(`git: '${sub ?? ""}' is not a git command. See 'git --help'`),
	},
	neofetch: {
		usage: "neofetch",
		description: "system info",
		run: () => out(NEOFETCH_OUTPUT),
	},
	cowsay: {
		usage: "cowsay <message>",
		description: "talking cow",
		run: (args) => out(cowsay(args.join(" ") || "Moo!")),
	},
	fortune: {
		usage: "fortune",
		description: "random quote",
		run: (_, { random }) => out(pick(FORTUNES, random)),
	},
	cal: {
		usage: "cal",
		description: "this month's calendar",
		run: (_, { now }) => out(calendar(now)),
	},
	sudo: {
		usage: "sudo <command>",
		description: "try it",
		run: (_, { random }) => err(pick(SUDO_RESPONSES, random)),
	},
	man: {
		usage: "man agus",
		description: "the developer manual",
		run: ([subject]) => {
			if (subject === "agus" || subject === "agus-darmawan")
				return out(MAN_PAGE);
			return err(
				subject
					? `No manual entry for ${subject}\nTry: man agus`
					: "What manual page do you want?\nTry: man agus",
			);
		},
	},
	open: {
		usage: "open <app>",
		description: "open a window",
		complete: "apps",
		run: ([app]) => {
			if (!app)
				return err(
					`open: missing app name\nUsage: open <${APP_IDS.join("|")}>`,
				);
			if (!isAppId(app)) {
				return err(
					`open: unknown app '${app}'\nAvailable: ${APP_IDS.join(", ")}`,
				);
			}
			return { ...out(`Opening ${app}…`), effect: { type: "open", app } };
		},
	},
	close: {
		usage: "close [app]",
		description: "close an app (default: the top-most other window)",
		complete: "apps",
		run: ([app]) => {
			if (app === undefined) return { lines: [], effect: { type: "close" } };
			if (!isAppId(app)) {
				return err(
					`close: unknown app '${app}'\nAvailable: ${APP_IDS.join(", ")}`,
				);
			}
			return { lines: [], effect: { type: "close", app } };
		},
	},
	theme: {
		usage: "theme <dark|light>",
		description: "switch theme",
		run: ([mode]) =>
			mode === "dark" || mode === "light"
				? { ...out(`Theme set to ${mode}.`), effect: { type: "theme", mode } }
				: err("Usage: theme <dark|light>"),
	},
	lang: {
		usage: "lang <en|id>",
		description: "switch language",
		run: ([locale]) =>
			locale && isLocale(locale)
				? {
						...out(`Language set to ${locale}.`),
						effect: { type: "lang", locale },
					}
				: err("Usage: lang <en|id>"),
	},
	exit: {
		usage: "exit",
		description: "close the terminal",
		run: () => ({ lines: [], effect: { type: "exit" } }),
	},
};

const ALIASES: Record<string, string> = { nano: "vim", gs: "git status" };

function helpText() {
	const rows = Object.values(COMMANDS).map((c) => [c.usage, c.description]);
	const width = Math.max(...rows.map(([usage]) => usage.length)) + 2;
	return [
		"Available commands:",
		"",
		...rows.map(([usage, desc]) => `  ${usage.padEnd(width)}${desc}`),
		"",
		"Tab completes commands, files and app names. ↑/↓ browse history.",
	].join("\n");
}

/** Run one command line. Pure: all state changes come back in the result. */
export function executeCommand(raw: string, context: Context): Result {
	const ctx: Required<Context> = {
		random: Math.random,
		now: new Date(),
		...context,
	};
	let line = raw.trim();
	const [first] = line.split(/\s+/);
	if (first && Object.hasOwn(ALIASES, first)) {
		line = line.replace(first, ALIASES[first]);
	}

	const [name, ...args] = line.split(/\s+/);
	if (!name) return { lines: [] };
	if (!Object.hasOwn(COMMANDS, name)) {
		return err(
			`${name}: command not found\nType 'help' for available commands.`,
		);
	}
	return COMMANDS[name].run(args, ctx, line);
}

/**
 * Tab completion for the current input: returns the new input when there
 * is exactly one match, or the candidates to list when there are several.
 */
export function complete(
	input: string,
	{ cwd, fs }: Pick<Context, "cwd" | "fs">,
): { input?: string; options?: string[] } {
	const parts = input.trimStart().split(/\s+/);
	const partial = parts.at(-1) ?? "";
	const [name] = parts;

	let candidates: string[];
	let base = "";
	if (parts.length <= 1) {
		candidates = [...Object.keys(COMMANDS), ...Object.keys(ALIASES)];
	} else {
		const kind = Object.hasOwn(COMMANDS, name)
			? COMMANDS[name].complete
			: Object.hasOwn(ALIASES, name)
				? COMMANDS[ALIASES[name].split(" ")[0]]?.complete
				: undefined;
		if (!kind) return {};

		if (kind === "apps") {
			candidates = [...APP_IDS];
		} else {
			// Complete inside the directory typed so far ("projects/po" → "projects/").
			const slash = partial.lastIndexOf("/");
			base = slash === -1 ? "" : partial.slice(0, slash + 1);
			const dir = resolvePath(cwd, base || ".");
			if (!isDir(fs, dir)) return {};
			const dirs = subdirs(fs, dir).map((d) => `${d}/`);
			const files = Object.keys(fs[dir]);
			candidates = kind === "dirs" ? dirs : [...dirs, ...files];
		}
	}

	const leaf = partial.slice(base.length);
	const matches = candidates.filter((c) => c.startsWith(leaf)).sort();
	if (matches.length === 0) return {};
	if (matches.length > 1) {
		const prefix = commonPrefix(matches);
		return prefix.length > leaf.length
			? { input: replaceLast(parts, base + prefix) }
			: { options: matches };
	}

	const [match] = matches;
	const suffix = match.endsWith("/") ? "" : " ";
	return { input: replaceLast(parts, base + match) + suffix };
}

const replaceLast = (parts: string[], value: string) =>
	[...parts.slice(0, -1), value].join(" ");

function commonPrefix(words: string[]) {
	let prefix = words[0];
	for (const word of words) {
		while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
	}
	return prefix;
}
