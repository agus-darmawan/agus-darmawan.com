import { describe, expect, it } from "vitest";
import type { VimSession } from "./types";
import { openVim, vimContent, vimKey } from "./vim";

const type = (s: VimSession, keys: string[]) => {
	let session = s;
	let action: string | undefined;
	for (const key of keys) ({ session, action } = vimKey(session, { key }));
	return { session, action };
};

describe("vim", () => {
	it("inserts text and writes with :w", () => {
		const { session, action } = type(openVim("~", "a.txt", ""), [
			"i",
			"h",
			"i",
			"Escape",
			":",
			"w",
			"Enter",
		]);
		expect(vimContent(session)).toBe("hi");
		expect(action).toBe("write");
		expect(session.modified).toBe(false);
	});

	it("refuses :q with unsaved changes", () => {
		const { session, action } = type(openVim("~", "a.txt", ""), [
			"i",
			"x",
			"Escape",
			":",
			"q",
			"Enter",
		]);
		expect(action).toBeUndefined();
		expect(session.statusMessage).toMatch(/E37/);
	});

	it("never inserts modifier shortcuts", () => {
		const start = vimKey(openVim("~", "a.txt", ""), { key: "i" }).session;
		const { session } = vimKey(start, { key: "c", ctrl: true });
		expect(vimContent(session)).toBe("");
	});

	it("supports dd, o and x", () => {
		const { session } = type(openVim("~", "a.txt", "one\ntwo\nthree"), [
			"j",
			"d",
			"d",
			"o",
			"n",
			"e",
			"w",
			"Escape",
			"0",
			"x",
		]);
		expect(vimContent(session)).toBe("one\nthree\new");
	});
});

describe("vim modifiers", () => {
	it("types AltGr / Option characters", () => {
		const start = vimKey(openVim("~", "a.txt", ""), { key: "i" }).session;
		const { session } = vimKey(start, { key: "@", ctrl: true, alt: true });
		expect(vimContent(session)).toBe("@");
	});

	it("treats Ctrl+[ as Escape", () => {
		const start = vimKey(openVim("~", "a.txt", ""), { key: "i" }).session;
		expect(vimKey(start, { key: "[", ctrl: true }).session.mode).toBe("normal");
	});
});
