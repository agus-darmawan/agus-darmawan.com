"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	defaultVim,
	type FSNode,
	INITIAL_FS,
	mkLine,
	type TermLine,
	type VimState,
} from "./terminalTypes";
import { useCommandProcessor } from "./useCommandProcessor";
import { VimEditor } from "./VimEditor";

export default function TerminalWindow() {
	const [lines, setLines] = useState<TermLine[]>([
		mkLine("system", "Ubuntu 22.04.3 LTS — agus@ubuntu — portfolio terminal"),
		mkLine("system", 'Type "help" for available commands.'),
		mkLine("system", ""),
	]);
	const [input, setInput] = useState("");
	const [cwd, setCwd] = useState("~");
	const [history, setHistory] = useState<string[]>([]);
	const [_, setHistIdx] = useState(-1);
	const [fs, setFs] = useState<FSNode>(INITIAL_FS);
	const [vim, setVim] = useState<VimState>(defaultVim());

	const inputRef = useRef<HTMLInputElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (!vim.active) inputRef.current?.focus();
	}, [vim.active]);

	const addLines = useCallback((...newLines: TermLine[]) => {
		setLines((prev) => [...prev, ...newLines]);
	}, []);

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
	});

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
				const partial = input.split(" ").pop() ?? "";
				const dir = fs[cwd] ?? {};
				const matches = Object.keys(dir).filter((k) => k.startsWith(partial));
				if (matches.length === 1) {
					const parts = input.split(" ");
					parts[parts.length - 1] = matches[0];
					setInput(parts.join(" "));
				} else if (matches.length > 1) {
					addLines(mkLine("output", matches.join("  ")));
				}
			} else if (e.key === "l" && e.ctrlKey) {
				e.preventDefault();
				clearTerminal();
			} else if (e.key === "c" && e.ctrlKey) {
				e.preventDefault();
				addLines(mkLine("input", `agus@ubuntu:${cwd}$ ${input}^C`));
				setInput("");
			}
		},
		[input, history, cwd, fs, processCommand, addLines, clearTerminal],
	);

	if (vim.active) {
		return (
			<VimEditor
				vim={vim}
				setVim={setVim}
				cwd={cwd}
				setFs={setFs}
				onClose={handleVimClose}
			/>
		);
	}

	return (
		<div
			className="h-full flex flex-col font-mono text-sm"
			style={{ background: "#0e0e0e", color: "#c8c8c8" }}
			onClick={() => inputRef.current?.focus()}
		>
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

				{/* Input line */}
				<div className="flex items-center" style={{ lineHeight: "1.4" }}>
					<span style={{ color: "#50fa7b", fontSize: "0.8rem" }}>
						agus@ubuntu:
					</span>
					<span style={{ color: "#8be9fd", fontSize: "0.8rem" }}>{cwd}</span>
					<span
						style={{ color: "#c8c8c8", fontSize: "0.8rem" }}
						className="mr-2"
					>
						${" "}
					</span>
					<input
						ref={inputRef}
						placeholder="Type a command..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						className="flex-1 bg-transparent outline-none border-none caret-green-400 "
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

			{/* Hints */}
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
					<span style={{ color: "#8be9fd" }}>Ctrl+L</span>=clear
				</span>
			</div>
		</div>
	);
}
