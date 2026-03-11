"use client";

import { useCallback, useEffect, useRef } from "react";
import { defaultVim, type FSNode, type VimState } from "./terminalTypes";

interface VimEditorProps {
	vim: VimState;
	setVim: (updater: (prev: VimState) => VimState) => void;
	cwd: string;
	setFs: (updater: (prev: FSNode) => FSNode) => void;
	onClose: (savedContent: string | null, filename: string) => void;
}

export function VimEditor({
	vim,
	setVim,
	cwd,
	setFs,
	onClose,
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
						} else if (prev.cursorLine > 0) {
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

			// Normal mode
			const normalMoves: Record<string, (prev: VimState) => Partial<VimState>> =
				{
					h: (prev) => ({ cursorCol: Math.max(0, prev.cursorCol - 1) }),
					ArrowLeft: (prev) => ({ cursorCol: Math.max(0, prev.cursorCol - 1) }),
					l: (prev) => ({
						cursorCol: Math.min(
							prev.cursorCol + 1,
							(prev.lines[prev.cursorLine]?.length ?? 1) - 1,
						),
					}),
					ArrowRight: (prev) => ({
						cursorCol: Math.min(
							prev.cursorCol + 1,
							(prev.lines[prev.cursorLine]?.length ?? 1) - 1,
						),
					}),
					j: (prev) => ({
						cursorLine: Math.min(prev.cursorLine + 1, prev.lines.length - 1),
					}),
					ArrowDown: (prev) => ({
						cursorLine: Math.min(prev.cursorLine + 1, prev.lines.length - 1),
					}),
					k: (prev) => ({ cursorLine: Math.max(prev.cursorLine - 1, 0) }),
					ArrowUp: (prev) => ({ cursorLine: Math.max(prev.cursorLine - 1, 0) }),
					"0": () => ({ cursorCol: 0 }),
					G: (prev) => ({ cursorLine: prev.lines.length - 1, cursorCol: 0 }),
					g: () => ({ cursorLine: 0, cursorCol: 0 }),
				};

			if (normalMoves[e.key]) {
				setVim((prev) => ({ ...prev, ...normalMoves[e.key](prev) }));
				return;
			}

			switch (e.key) {
				case "i":
					setVim((prev) => ({
						...prev,
						mode: "insert",
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
						const lines = [...prev.lines];
						lines.splice(prev.cursorLine + 1, 0, "");
						return {
							...prev,
							lines,
							cursorLine: prev.cursorLine + 1,
							cursorCol: 0,
							mode: "insert",
							statusMessage: "-- INSERT --",
							modified: true,
						};
					});
					break;
				case "x":
					setVim((prev) => {
						const lines = [...prev.lines];
						const line = lines[prev.cursorLine];
						lines[prev.cursorLine] =
							line.slice(0, prev.cursorCol) + line.slice(prev.cursorCol + 1);
						return { ...prev, lines, modified: true };
					});
					break;
				case ":":
					setVim((prev) => ({
						...prev,
						mode: "command",
						commandBuffer: ":",
						statusMessage: "",
					}));
					break;
				case "Escape":
					setVim((prev) => ({ ...prev, statusMessage: "" }));
					break;
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
			className="h-full flex flex-col font-mono text-sm"
			style={{ background: "#1a1a2e", color: "#e0e0e0" }}
			onClick={() => inputRef.current?.focus()}
		>
			<input
				ref={inputRef}
				onKeyDown={handleKey}
				className="absolute opacity-0 w-0 h-0"
				readOnly
				aria-label="vim input"
			/>

			{/* Title */}
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
				<span style={{ color: "#e94560" }}>{vim.mode.toUpperCase()}</span>
			</div>

			{/* Editor */}
			<div className="flex-1 overflow-hidden">
				{visibleLines.map((line, idx) => {
					const absLine = start + idx;
					const isCursor = absLine === vim.cursorLine;
					return (
						<div
							key={absLine}
							className="flex min-h-5"
							style={{
								background: isCursor ? "rgba(255,255,255,0.05)" : "transparent",
							}}
						>
							<span
								className="w-10 shrink-0 text-right pr-3 select-none text-xs"
								style={{
									color: isCursor ? "#e94560" : "#404060",
									lineHeight: "1.4",
								}}
							>
								{absLine + 1}
							</span>
							<span
								className="flex-1 whitespace-pre"
								style={{ lineHeight: "1.4" }}
							>
								{isCursor ? (
									<>
										<span>{line.slice(0, vim.cursorCol)}</span>
										<span
											style={{
												background:
													vim.mode === "insert" ? "#e94560" : "#00d4ff",
												color: "#1a1a2e",
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
				{Array.from({ length: Math.max(0, VISIBLE - visibleLines.length) }).map(
					(_, i) => (
						<div key={`t${i}`} className="flex min-h-5">
							<span
								className="w-10 shrink-0 text-right pr-3 text-xs select-none"
								style={{ color: "#404060", lineHeight: "1.4" }}
							>
								~
							</span>
						</div>
					),
				)}
			</div>

			{/* Status */}
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
				</span>
			</div>

			{/* Hints */}
			<div
				className="px-3 py-1 text-xs shrink-0"
				style={{
					background: "#0a0a1a",
					color: "#505070",
					borderTop: "1px solid #1a1a3e",
				}}
			>
				<span style={{ color: "#00d4ff" }}>i</span>=insert{" "}
				<span style={{ color: "#00d4ff" }}>Esc</span>=normal{" "}
				<span style={{ color: "#00d4ff" }}>:w</span>=save{" "}
				<span style={{ color: "#00d4ff" }}>:q!</span>=quit{" "}
				<span style={{ color: "#00d4ff" }}>:wq</span>=save&amp;quit
			</div>
		</div>
	);
}
