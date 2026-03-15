export interface TermLine {
	id: number;
	type: "input" | "output" | "error" | "system";
	text: string;
}

export type FSNode = Record<string, Record<string, string>>;

let _lineId = 0;
export const mkLine = (type: TermLine["type"], text: string): TermLine => ({
	id: _lineId++,
	type,
	text,
});

export const INITIAL_FS: FSNode = {
	"~": {
		".bashrc":
			"# ~/.bashrc\nexport PS1='agus@ubuntu:~$ '\nexport PATH=$PATH:/usr/local/bin\nalias ll='ls -la'\nalias gs='git status'",
		"README.md":
			"# Welcome to Agus's Portfolio Terminal\n\nType `help` to see available commands.\n\nGitHub: github.com/agus-darmawan",
	},
	"~/projects": {
		"portfolio.md":
			"# Portfolio Website\n\nStack: Next.js 16, TypeScript, Tailwind CSS\nStatus: Active development",
	},
	"~/documents": {
		"resume.txt":
			"AGUS DARMAWAN\nFull-Stack Developer\n\nSKILLS: TypeScript, Go, Python, React, Next.js, PostgreSQL, Docker",
	},
	"~/downloads": {},
};

export interface VimState {
	active: boolean;
	filename: string;
	lines: string[];
	cursorLine: number;
	cursorCol: number;
	mode: "normal" | "insert" | "command";
	commandBuffer: string;
	statusMessage: string;
	modified: boolean;
}

export const defaultVim = (): VimState => ({
	active: false,
	filename: "",
	lines: [""],
	cursorLine: 0,
	cursorCol: 0,
	mode: "normal",
	commandBuffer: "",
	statusMessage: "",
	modified: false,
});
