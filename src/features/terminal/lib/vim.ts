import type { VimSession } from "./types";

export interface VimKey {
	key: string;
	ctrl?: boolean;
	meta?: boolean;
	alt?: boolean;
}

type VimAction = "write" | "quit" | "write-quit";

export interface VimResult {
	session: VimSession;
	action?: VimAction;
}

export function openVim(
	dir: string,
	filename: string,
	content: string,
): VimSession {
	const lines = content ? content.split("\n") : [""];
	return {
		dir,
		filename,
		lines,
		cursorLine: 0,
		cursorCol: 0,
		mode: "normal",
		commandBuffer: "",
		statusMessage: `"${filename}" ${content ? `${lines.length}L, ${content.length}B` : "[New File]"}`,
		modified: false,
	};
}

export const vimContent = (s: VimSession) => s.lines.join("\n");

const clampCol = (s: VimSession, col: number, insert = false) => {
	const len = s.lines[s.cursorLine]?.length ?? 0;
	return Math.max(0, Math.min(col, insert ? len : Math.max(0, len - 1)));
};

function moveTo(s: VimSession, line: number, col = s.cursorCol): VimSession {
	const cursorLine = Math.max(0, Math.min(line, s.lines.length - 1));
	const next = { ...s, cursorLine };
	return { ...next, cursorCol: clampCol(next, col, s.mode === "insert") };
}

function edit(
	s: VimSession,
	lines: string[],
	line: number,
	col: number,
): VimSession {
	return { ...s, lines, cursorLine: line, cursorCol: col, modified: true };
}

const toInsert = (s: VimSession, col = s.cursorCol): VimSession => {
	const next: VimSession = {
		...s,
		mode: "insert",
		statusMessage: "-- INSERT --",
	};
	return { ...next, cursorCol: clampCol(next, col, true) };
};

function insertKey(s: VimSession, { key }: VimKey): VimSession {
	const lines = [...s.lines];
	const current = lines[s.cursorLine] ?? "";
	const before = current.slice(0, s.cursorCol);
	const after = current.slice(s.cursorCol);

	switch (key) {
		case "Escape":
			return {
				...s,
				mode: "normal",
				statusMessage: "",
				cursorCol: Math.max(0, s.cursorCol - 1),
			};
		case "Enter":
			lines.splice(s.cursorLine, 1, before, after);
			return edit(s, lines, s.cursorLine + 1, 0);
		case "Backspace":
			if (s.cursorCol > 0) {
				lines[s.cursorLine] = before.slice(0, -1) + after;
				return edit(s, lines, s.cursorLine, s.cursorCol - 1);
			}
			if (s.cursorLine === 0) return s;
			{
				const prev = lines[s.cursorLine - 1];
				lines.splice(s.cursorLine - 1, 2, prev + current);
				return edit(s, lines, s.cursorLine - 1, prev.length);
			}
		case "Delete":
			if (after) lines[s.cursorLine] = before + after.slice(1);
			else if (s.cursorLine < lines.length - 1) {
				lines.splice(s.cursorLine, 2, current + lines[s.cursorLine + 1]);
			} else return s;
			return edit(s, lines, s.cursorLine, s.cursorCol);
		case "Tab":
			lines[s.cursorLine] = `${before}  ${after}`;
			return edit(s, lines, s.cursorLine, s.cursorCol + 2);
		case "ArrowLeft":
			return moveTo(s, s.cursorLine, s.cursorCol - 1);
		case "ArrowRight":
			return moveTo(s, s.cursorLine, s.cursorCol + 1);
		case "ArrowUp":
			return moveTo(s, s.cursorLine - 1);
		case "ArrowDown":
			return moveTo(s, s.cursorLine + 1);
		default:
			if (key.length !== 1) return s;
			lines[s.cursorLine] = before + key + after;
			return edit(s, lines, s.cursorLine, s.cursorCol + 1);
	}
}

function normalKey(s: VimSession, { key }: VimKey): VimSession {
	const pending = s.commandBuffer;
	const clear = { ...s, commandBuffer: "" };

	// Two-key commands: dd, gg.
	if (pending === "d" && key === "d") {
		const lines =
			s.lines.length > 1 ? s.lines.filter((_, i) => i !== s.cursorLine) : [""];
		return moveTo(edit(clear, lines, s.cursorLine, 0), s.cursorLine, 0);
	}
	if (pending === "g" && key === "g") return moveTo(clear, 0, 0);

	const line = s.lines[s.cursorLine] ?? "";
	switch (key) {
		case "i":
			return toInsert(clear);
		case "a":
			return toInsert(clear, s.cursorCol + 1);
		case "I":
			return toInsert(clear, line.search(/\S|$/));
		case "A":
			return toInsert(clear, line.length);
		case "o":
		case "O": {
			const at = key === "o" ? s.cursorLine + 1 : s.cursorLine;
			const lines = [...s.lines];
			lines.splice(at, 0, "");
			return toInsert(edit(clear, lines, at, 0), 0);
		}
		case "x": {
			if (!line) return clear;
			const lines = [...s.lines];
			lines[s.cursorLine] =
				line.slice(0, s.cursorCol) + line.slice(s.cursorCol + 1);
			const next = edit(clear, lines, s.cursorLine, s.cursorCol);
			return { ...next, cursorCol: clampCol(next, s.cursorCol) };
		}
		case "h":
		case "ArrowLeft":
		case "Backspace":
			return moveTo(clear, s.cursorLine, s.cursorCol - 1);
		case "l":
		case "ArrowRight":
		case " ":
			return moveTo(clear, s.cursorLine, s.cursorCol + 1);
		case "k":
		case "ArrowUp":
			return moveTo(clear, s.cursorLine - 1);
		case "j":
		case "ArrowDown":
		case "Enter":
			return moveTo(clear, s.cursorLine + 1);
		case "0":
		case "Home":
			return moveTo(clear, s.cursorLine, 0);
		case "$":
		case "End":
			return moveTo(clear, s.cursorLine, line.length);
		case "G":
			return moveTo(clear, s.lines.length - 1);
		case "d":
		case "g":
			return { ...s, commandBuffer: key };
		case ":":
			return { ...s, mode: "command", commandBuffer: ":", statusMessage: "" };
		case "Escape":
			return { ...clear, statusMessage: "" };
		default:
			return clear;
	}
}

function commandKey(s: VimSession, { key }: VimKey): VimResult {
	const normal = (statusMessage = ""): VimSession => ({
		...s,
		mode: "normal",
		commandBuffer: "",
		statusMessage,
	});

	if (key === "Escape") return { session: normal() };
	if (key === "Backspace") {
		return s.commandBuffer.length <= 1
			? { session: normal() }
			: { session: { ...s, commandBuffer: s.commandBuffer.slice(0, -1) } };
	}
	if (key !== "Enter") {
		return key.length === 1
			? { session: { ...s, commandBuffer: s.commandBuffer + key } }
			: { session: s };
	}

	const cmd = s.commandBuffer.slice(1).trim();
	switch (cmd) {
		case "w": {
			const content = vimContent(s);
			return {
				session: {
					...normal(
						`"${s.filename}" ${s.lines.length}L, ${content.length}B written`,
					),
					modified: false,
				},
				action: "write",
			};
		}
		case "wq":
		case "x":
			return { session: normal(), action: "write-quit" };
		case "q!":
			return { session: normal(), action: "quit" };
		case "q":
			return s.modified
				? {
						session: normal(
							"E37: No write since last change (add ! to override)",
						),
					}
				: { session: normal(), action: "quit" };
		default:
			return {
				session: normal(cmd ? `E492: Not an editor command: ${cmd}` : ""),
			};
	}
}

export const isShortcut = ({ ctrl, meta, alt }: VimKey) =>
	Boolean(meta || (ctrl && !alt));

/** Apply one key press. Pure — the caller persists `write` actions. */
export function vimKey(s: VimSession, input: VimKey): VimResult {
	// Ctrl/⌘ shortcuts are not text. Alt is: AltGr reports Ctrl+Alt on
	// Windows and macOS Option types characters (@, {, [ on many layouts).
	if (isShortcut(input)) {
		return input.ctrl && input.key === "["
			? vimKey(s, { key: "Escape" })
			: { session: s };
	}
	if (s.mode === "insert") return { session: insertKey(s, input) };
	if (s.mode === "command") return commandKey(s, input);
	return { session: normalKey(s, input) };
}
