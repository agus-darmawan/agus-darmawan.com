import type { LineKind, TermLine } from "./types";

// A plain counter: `crypto.randomUUID()` only exists in secure contexts and
// threw on plain-HTTP previews (LAN IPs, some proxies).
let nextId = 0;

export const mkLine = (kind: LineKind, text: string): TermLine => ({
	id: ++nextId,
	kind,
	text,
});

export const HOME = "/home/agus";
export const USER = "agus";
const HOST = "ubuntu";

export const prompt = (cwd: string) => `${USER}@${HOST}:${cwd}$`;
