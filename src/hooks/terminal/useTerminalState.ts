import { useCallback, useRef, useState } from "react";
import {
	defaultVim,
	type FSNode,
	INITIAL_FS,
	mkLine,
	type TermLine,
	type VimState,
} from "@/types/terminal";
import { useCommandProcessor } from "./useCommandProcessor";

interface UseTerminalStateOptions {
	welcomeMsg: string;
	helpHint: string;
	sessionClosedMsg: string;
}

export function useTerminalState({
	welcomeMsg,
	helpHint,
	sessionClosedMsg,
}: UseTerminalStateOptions) {
	const [lines, setLines] = useState<TermLine[]>([
		mkLine("system", welcomeMsg),
		mkLine("system", helpHint),
		mkLine("system", ""),
	]);
	const [input, setInput] = useState("");
	const [cwd, setCwd] = useState("~");
	const [history, setHistory] = useState<string[]>([]);
	const [histIdx, setHistIdx] = useState(-1);
	const [fs, setFs] = useState<FSNode>(INITIAL_FS);
	const [vim, setVim] = useState<VimState>(defaultVim());

	const inputRef = useRef<HTMLInputElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const addLines = useCallback((...newLines: TermLine[]) => {
		setLines((prev) => [...prev, ...newLines]);
	}, []);

	const addOutputLine = useCallback(
		(text: string) => {
			addLines(mkLine("output", text));
		},
		[addLines],
	);

	const clearTerminal = useCallback(() => {
		setLines([mkLine("system", "")]);
	}, []);

	const openVim = useCallback((filename: string, content: string) => {
		setVim({
			active: true,
			filename,
			lines: content ? content.split("\n") : [""],
			cursorLine: 0,
			cursorCol: 0,
			mode: "normal",
			commandBuffer: "",
			statusMessage: `"${filename}" ${content ? `${content.split("\n").length}L` : "[New File]"}`,
			modified: false,
		});
	}, []);

	const handleVimClose = useCallback(
		(savedContent: string | null, filename: string) => {
			setVim(defaultVim());
			if (savedContent !== null) {
				addLines(mkLine("output", `"${filename}" written`));
			}
		},
		[addLines],
	);

	const { processCommand } = useCommandProcessor({
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
	});

	const handleSubmit = useCallback(
		(val: string) => {
			processCommand(val);
			setTimeout(scrollToBottom, 50);
		},
		[processCommand, scrollToBottom],
	);

	const handleHistoryUp = useCallback(() => {
		setHistIdx((i) => {
			const ni = Math.min(i + 1, history.length - 1);
			setInput(history[ni] ?? "");
			return ni;
		});
	}, [history]);

	const handleHistoryDown = useCallback(() => {
		setHistIdx((i) => {
			const ni = Math.max(i - 1, -1);
			setInput(ni === -1 ? "" : (history[ni] ?? ""));
			return ni;
		});
	}, [history]);

	return {
		lines,
		input,
		setInput,
		cwd,
		history,
		histIdx,
		fs,
		vim,
		setVim,
		inputRef,
		bottomRef,
		addLines,
		addOutputLine,
		clearTerminal,
		openVim,
		handleVimClose,
		handleSubmit,
		handleHistoryUp,
		handleHistoryDown,
	};
}
