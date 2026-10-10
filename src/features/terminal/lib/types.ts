export type LineKind = "input" | "output" | "error" | "system";

export interface TermLine {
	id: number;
	kind: LineKind;
	text: string;
}

/** Directory path ("~", "~/projects") → file name → file contents. */
export type FileSystem = Record<string, Record<string, string>>;

export interface VimSession {
	/** Directory + name of the file being edited. */
	dir: string;
	filename: string;
	lines: string[];
	cursorLine: number;
	cursorCol: number;
	mode: "normal" | "insert" | "command";
	commandBuffer: string;
	statusMessage: string;
	modified: boolean;
}
