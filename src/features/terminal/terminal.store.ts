import { create } from "zustand";
import { type Effect, executeCommand } from "./lib/commands";
import { INITIAL_FS, writeFile } from "./lib/fs";
import { mkLine, prompt } from "./lib/lines";
import type { FileSystem, TermLine, VimSession } from "./lib/types";
import {
	openVim as startVim,
	type VimKey,
	vimContent,
	vimKey,
} from "./lib/vim";

const MAX_HISTORY = 100;
const MAX_LINES = 500;

interface TerminalStore {
	lines: TermLine[];
	input: string;
	cwd: string;
	fs: FileSystem;
	/** Newest first. */
	history: string[];
	/** -1 = editing a fresh line; otherwise an index into `history`. */
	historyIndex: number;
	vim: VimSession | null;
	/** The translated banner, until the first `clear`. */
	showWelcome: boolean;

	setInput: (input: string) => void;
	/** Run a command line; returns the UI side effect to apply, if any. */
	submit: (raw: string) => Effect | undefined;
	print: (...lines: TermLine[]) => void;
	updateLine: (id: number, text: string) => void;
	interrupt: () => void;
	clear: () => void;
	browseHistory: (direction: "up" | "down") => void;
	openVim: (dir: string, filename: string, content: string) => void;
	vimKey: (key: VimKey) => void;
	/** Fresh session (used by `exit`). */
	reset: () => void;
}

const initialState = () => ({
	lines: [] as TermLine[],
	input: "",
	cwd: "~",
	fs: INITIAL_FS,
	history: [] as string[],
	historyIndex: -1,
	vim: null as VimSession | null,
	showWelcome: true,
});

const capped = (lines: TermLine[]) =>
	lines.length > MAX_LINES ? lines.slice(-MAX_LINES) : lines;

/**
 * Terminal session state. Lives outside React so it survives minimizing
 * the window and switching languages (which remounts the page tree).
 */
export const useTerminalStore = create<TerminalStore>((set, get) => ({
	...initialState(),

	setInput: (input) => set({ input, historyIndex: -1 }),

	submit: (raw) => {
		const { cwd, fs, history, lines } = get();
		const command = raw.trim();
		const echo = mkLine("input", `${prompt(cwd)} ${raw}`);

		if (!command) {
			set({ lines: capped([...lines, echo]), input: "", historyIndex: -1 });
			return undefined;
		}

		const result = executeCommand(command, { cwd, fs, history });
		set({
			lines: capped([...lines, echo, ...result.lines]),
			cwd: result.cwd ?? cwd,
			fs: result.fs ?? fs,
			history: [command, ...history.filter((h) => h !== command)].slice(
				0,
				MAX_HISTORY,
			),
			historyIndex: -1,
			input: "",
		});
		return result.effect;
	},

	print: (...printed) =>
		set((s) => ({ lines: capped([...s.lines, ...printed]) })),

	updateLine: (id, text) =>
		set((s) => ({
			lines: s.lines.map((l) => (l.id === id ? { ...l, text } : l)),
		})),

	interrupt: () =>
		set((s) => ({
			lines: capped([
				...s.lines,
				mkLine("input", `${prompt(s.cwd)} ${s.input}^C`),
			]),
			input: "",
			historyIndex: -1,
		})),

	clear: () => set({ lines: [], showWelcome: false }),

	browseHistory: (direction) => {
		const { history, historyIndex } = get();
		if (history.length === 0) return;
		const index =
			direction === "up"
				? Math.min(historyIndex + 1, history.length - 1)
				: Math.max(historyIndex - 1, -1);
		set({ historyIndex: index, input: index === -1 ? "" : history[index] });
	},

	openVim: (dir, filename, content) =>
		set({ vim: startVim(dir, filename, content) }),

	vimKey: (key) => {
		const { vim, fs } = get();
		if (!vim) return;
		const { session, action } = vimKey(vim, key);
		// `:w` used to be a no-op (the save callback was `() => {}`).
		const saved =
			action === "write" || action === "write-quit"
				? writeFile(fs, session.dir, session.filename, vimContent(session))
				: fs;

		if (action === "quit" || action === "write-quit") {
			set((s) => ({
				vim: null,
				fs: saved,
				lines:
					action === "write-quit"
						? capped([
								...s.lines,
								mkLine("output", `"${session.filename}" written`),
							])
						: s.lines,
			}));
		} else {
			set({ vim: session, fs: saved });
		}
	},

	reset: () => set(initialState()),
}));
