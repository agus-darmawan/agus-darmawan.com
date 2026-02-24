"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface HistoryEntry {
	type: "input" | "output" | "error";
	text: string;
}

export default function TerminalWindow() {
	const t = useTranslations("TerminalWindow");
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<HistoryEntry[]>([
		{ type: "output", text: t("welcome") },
	]);
	const [cmdHistory, setCmdHistory] = useState<string[]>([]);
	const [historyIdx, setHistoryIdx] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [history]);

	const processCommand = (cmd: string) => {
		const trimmed = cmd.trim().toLowerCase();

		if (!trimmed) return null;

		switch (trimmed) {
			case "help":
				return t("helpText");
			case "about":
				return t("aboutText");
			case "skills":
				return t("skillsText");
			case "experience":
				return t("experienceText");
			case "projects":
				return t("projectsText");
			case "contact":
				return t("contactText");
			case "whoami":
				return "agus@ubuntu-portfolio";
			case "pwd":
				return "/home/agus/portfolio";
			case "ls":
				return "about/  experience/  projects/  contact/  resume.pdf";
			case "date":
				return new Date().toString();
			case "echo hello":
				return "hello";
			case "uname -a":
				return "Linux ubuntu-portfolio 6.5.0-ubuntu #1 SMP PREEMPT_DYNAMIC Thu Jan 1 00:00:00 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux";
			case "clear":
				return "__CLEAR__";
			default:
				return t("notFound").replace("{cmd}", cmd.trim());
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const cmd = input;
		setInput("");
		setHistoryIdx(-1);

		if (cmd.trim()) {
			setCmdHistory((prev) => [cmd.trim(), ...prev]);
		}

		const newEntries: HistoryEntry[] = [{ type: "input", text: cmd }];
		const result = processCommand(cmd);

		if (result === "__CLEAR__") {
			setHistory([{ type: "output", text: t("welcome") }]);
			return;
		}

		if (result) {
			const isError = result.startsWith(t("notFound").split("{cmd}")[0]);
			newEntries.push({ type: isError ? "error" : "output", text: result });
		}

		setHistory((prev) => [...prev, ...newEntries]);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
			setHistoryIdx(newIdx);
			setInput(cmdHistory[newIdx] ?? "");
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			const newIdx = Math.max(historyIdx - 1, -1);
			setHistoryIdx(newIdx);
			setInput(newIdx === -1 ? "" : (cmdHistory[newIdx] ?? ""));
		} else if (e.key === "Tab") {
			e.preventDefault();
			const commands = [
				"help",
				"about",
				"skills",
				"experience",
				"projects",
				"contact",
				"clear",
				"whoami",
				"pwd",
				"ls",
				"date",
			];
			const match = commands.find((c) => c.startsWith(input));
			if (match) setInput(match);
		}
	};

	return (
		<div
			className="h-full flex flex-col font-mono text-sm cursor-text"
			style={{ background: "#300a24", color: "#d3d7cf" }}
			onClick={() => inputRef.current?.focus()}
		>
			{/* Terminal header bar */}
			<div
				className="px-4 py-1.5 text-xs flex items-center justify-between shrink-0"
				style={{
					background: "rgba(0,0,0,0.3)",
					borderBottom: "1px solid rgba(255,255,255,0.05)",
				}}
			>
				<span style={{ color: "rgba(255,255,255,0.4)" }}>
					agus@ubuntu-portfolio: ~/portfolio
				</span>
				<span style={{ color: "rgba(255,255,255,0.3)" }}>{t("title")}</span>
			</div>

			{/* Output area */}
			<div className="flex-1 overflow-auto px-4 py-3 space-y-1">
				{history.map((entry, i) => {
					if (entry.type === "input") {
						return (
							<div key={i} className="flex gap-1">
								<span style={{ color: "#4e9a06" }}>agus@ubuntu</span>
								<span style={{ color: "rgba(255,255,255,0.5)" }}>:</span>
								<span style={{ color: "#3465a4" }}>~</span>
								<span style={{ color: "rgba(255,255,255,0.5)" }}>$</span>
								<span className="ml-1">{entry.text}</span>
							</div>
						);
					}

					// Output — handle multi-line
					return (
						<div
							key={i}
							className="ml-1 leading-relaxed"
							style={{
								color: entry.type === "error" ? "#cc0000" : "#d3d7cf",
								whiteSpace: "pre-wrap",
							}}
						>
							{entry.text}
						</div>
					);
				})}

				{/* Input line */}
				<form onSubmit={handleSubmit} className="flex gap-1 items-center">
					<span style={{ color: "#4e9a06" }}>agus@ubuntu</span>
					<span style={{ color: "rgba(255,255,255,0.5)" }}>:</span>
					<span style={{ color: "#3465a4" }}>~</span>
					<span style={{ color: "rgba(255,255,255,0.5)" }}>$</span>
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						className="flex-1 bg-transparent outline-none ml-1 caret-white"
						style={{ color: "#d3d7cf" }}
						spellCheck={false}
						autoComplete="off"
						autoFocus
					/>
				</form>

				<div ref={bottomRef} />
			</div>

			{/* Status bar */}
			<div
				className="px-4 py-1 text-xs flex items-center gap-4 shrink-0"
				style={{
					background: "rgba(0,0,0,0.3)",
					borderTop: "1px solid rgba(255,255,255,0.05)",
					color: "rgba(255,255,255,0.35)",
				}}
			>
				<span>bash</span>
				<span>·</span>
				<span>
					Type <span style={{ color: "#e95420" }}>help</span> for commands
				</span>
				<span>·</span>
				<span>↑↓ history · Tab autocomplete</span>
			</div>
		</div>
	);
}
