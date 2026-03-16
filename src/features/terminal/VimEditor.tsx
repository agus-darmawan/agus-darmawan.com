"use client";

import { useCallback, useEffect, useRef } from "react";
import { type FSNode, type VimState } from "./types/terminal.types";

interface VimEditorProps {
	vim: VimState;
	setVim: (updater: (prev: VimState) => VimState) => void;
	cwd: string;
	setFs: (updater: (prev: FSNode) => FSNode) => void;
	onClose: (savedContent: string | null, filename: string) => void;
	hints: { key: string; desc: string }[];
}

export function VimEditor({
	vim,
	setVim,
	cwd,
	setFs,
	onClose,
	hints,
}: VimEditorProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const vimRef = useRef(vim);

	useEffect(() => {
		vimRef.current = vim;
	}, [vim]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleKey = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			e.preventDefault();
			const v = vimRef.current;

			/* ===== INSERT MODE ===== */
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
						const lines = [...prev.lines];
						const before = lines[prev.cursorLine].slice(0, prev.cursorCol);
						const after = lines[prev.cursorLine].slice(prev.cursorCol);

						lines[prev.cursorLine] = before;
						lines.splice(prev.cursorLine + 1, 0, after);

						return {
							...prev,
							lines,
							cursorLine: prev.cursorLine + 1,
							cursorCol: 0,
							modified: true,
						};
					});
				} else if (e.key === "Backspace") {
					setVim((prev) => {
						const lines = [...prev.lines];

						if (prev.cursorCol > 0) {
							lines[prev.cursorLine] =
								lines[prev.cursorLine].slice(0, prev.cursorCol - 1) +
								lines[prev.cursorLine].slice(prev.cursorCol);

							return {
								...prev,
								lines,
								cursorCol: prev.cursorCol - 1,
								modified: true,
							};
						}

						if (prev.cursorLine > 0) {
							const prevLen = lines[prev.cursorLine - 1].length;

							lines[prev.cursorLine - 1] += lines[prev.cursorLine];
							lines.splice(prev.cursorLine, 1);

							return {
								...prev,
								lines,
								cursorLine: prev.cursorLine - 1,
								cursorCol: prevLen,
								modified: true,
							};
						}

						return prev;
					});
				} else if (e.key.length === 1) {
					setVim((prev) => {
						const lines = [...prev.lines];
						const line = lines[prev.cursorLine] ?? "";

						lines[prev.cursorLine] =
							line.slice(0, prev.cursorCol) +
							e.key +
							line.slice(prev.cursorCol);

						return {
							...prev,
							lines,
							cursorCol: prev.cursorCol + 1,
							modified: true,
						};
					});
				}
				return;
			}

			/* ===== COMMAND MODE ===== */
			if (v.mode === "command") {
				if (e.key === "Escape") {
					setVim((prev) => ({
						...prev,
						mode: "normal",
						commandBuffer: "",
						statusMessage: "",
					}));
				} else if (e.key === "Enter") {
					const cmd = v.commandBuffer.slice(1);

					if (cmd === "w" || cmd === "wq" || cmd === "x") {
						const content = v.lines.join("\n");

						setFs((prev) => ({
							...prev,
							[cwd]: { ...(prev[cwd] ?? {}), [v.filename]: content },
						}));

						if (cmd === "wq" || cmd === "x") {
							onClose(content, v.filename);
						} else {
							setVim((prev) => ({
								...prev,
								mode: "normal",
								commandBuffer: "",
								statusMessage: `"${v.filename}" written`,
								modified: false,
							}));
						}
					} else if (cmd === "q!" || (cmd === "q" && !v.modified)) {
						onClose(null, v.filename);
					} else if (cmd === "q" && v.modified) {
						setVim((prev) => ({
							...prev,
							mode: "normal",
							commandBuffer: "",
							statusMessage:
								"E37: No write since last change (add ! to override)",
						}));
					} else {
						setVim((prev) => ({
							...prev,
							mode: "normal",
							commandBuffer: "",
							statusMessage: `E492: Not an editor command: ${cmd}`,
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

			/* ===== NORMAL MODE ===== */

			if (e.key === "i") {
				setVim((prev) => ({
					...prev,
					mode: "insert",
					statusMessage: "-- INSERT --",
				}));
			}

			if (e.key === ":") {
				setVim((prev) => ({
					...prev,
					mode: "command",
					commandBuffer: ":",
				}));
			}
		},
		[cwd, setFs, setVim, onClose],
	);

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
			className="flex flex-col h-full bg-[#1a1a2e] text-gray-200 font-mono text-sm"
			onClick={() => inputRef.current?.focus()}
		>
			<input
				ref={inputRef}
				onKeyDown={handleKey}
				className="absolute opacity-0 w-0 h-0"
				readOnly
				title="Vim editor input"
			/>

			{/* Title bar */}
			<div className="flex justify-between px-3 py-1 text-xs bg-[#16213e] border-b border-[#0f3460] text-gray-400">
				<span>
					VIM — {vim.filename}
					{vim.modified ? " [+]" : ""}
				</span>

				<span className="text-pink-500 uppercase">{vim.mode}</span>
			</div>

			{/* Editor */}
			<div className="flex-1 overflow-hidden">
				{visibleLines.map((line, idx) => {
					const absLine = start + idx;
					const isCursor = absLine === vim.cursorLine;

					return (
						<div
							key={absLine}
							className={`flex min-h-5 ${isCursor ? "bg-white/5" : ""}`}
						>
							<span
								className={`w-10 pr-3 text-right text-xs select-none ${
									isCursor ? "text-pink-500" : "text-gray-600"
								}`}
							>
								{absLine + 1}
							</span>

							<span className="flex-1 whitespace-pre">
								{isCursor ? (
									<>
										<span>{line.slice(0, vim.cursorCol)}</span>

										<span
											className={`${
												vim.mode === "insert"
													? "bg-pink-500 text-black"
													: "bg-cyan-400 text-black"
											}`}
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
			</div>

			<div
				className={`flex justify-between px-3 py-1 text-xs ${
					vim.mode === "insert" ? "bg-pink-500 text-black" : "bg-[#0f3460]"
				}`}
			>
				<span>
					{vim.mode === "command" ? vim.commandBuffer : vim.statusMessage}
				</span>
				<span>
					{vim.cursorLine + 1},{vim.cursorCol + 1}
				</span>
			</div>
			<div className="px-3 py-1 text-xs bg-[#0a0a1a] text-gray-500 border-t border-[#1a1a3e]">
				{hints.map(({ key, desc }, i) => (
					<span key={i}>
						<span className="text-cyan-400">{key}</span>
						{desc}
						{i < hints.length - 1 ? " " : ""}
					</span>
				))}
			</div>
		</div>
	);
}
