import { describe, expect, it } from "vitest";
import { type Context, calendar, complete, executeCommand } from "./commands";
import { INITIAL_FS, resolvePath } from "./fs";

const ctx = (over: Partial<Context> = {}): Context => ({
	cwd: "~",
	fs: INITIAL_FS,
	history: [],
	random: () => 0,
	now: new Date(2026, 9, 10),
	...over,
});

const text = (r: ReturnType<typeof executeCommand>) =>
	r.lines.map((l) => l.text).join("\n");

describe("resolvePath", () => {
	it.each([
		["~", "", "~"],
		["~", "projects", "~/projects"],
		["~/projects", "..", "~"],
		["~", "..", "~"],
		["~", "/home/agus/documents/", "~/documents"],
		["~/projects", "./../documents", "~/documents"],
		["~", "/", "/"],
	])("%s + %s → %s", (cwd, arg, expected) => {
		expect(resolvePath(cwd, arg)).toBe(expected);
	});
});

describe("executeCommand", () => {
	it("does not crash on prototype keys", () => {
		for (const name of ["__proto__", "constructor", "toString"]) {
			expect(text(executeCommand(`cat ${name}`, ctx()))).toMatch(
				/No such file/,
			);
			expect(text(executeCommand(name, ctx()))).toMatch(/command not found/);
		}
	});

	it("reads files by relative and absolute paths", () => {
		expect(text(executeCommand("cat projects/portfolio.md", ctx()))).toMatch(
			/Portfolio Website/,
		);
		expect(text(executeCommand("cat ~/documents/resume.txt", ctx()))).toMatch(
			/AGUS DARMAWAN/,
		);
		expect(text(executeCommand("cat projects", ctx()))).toMatch(
			/Is a directory/,
		);
	});

	it("touch keeps existing contents", () => {
		const { fs } = executeCommand("touch README.md", ctx());
		expect(fs?.["~"]["README.md"]).toBe(INITIAL_FS["~"]["README.md"]);
	});

	it("mkdir refuses to overwrite", () => {
		expect(text(executeCommand("mkdir projects", ctx()))).toMatch(
			/File exists/,
		);
		const { fs } = executeCommand("mkdir notes", ctx());
		expect(fs?.["~/notes"]).toEqual({});
	});

	it("echo writes and appends", () => {
		const first = executeCommand('echo "hello world" > note.txt', ctx());
		expect(first.fs?.["~"]["note.txt"]).toBe("hello world");
		const second = executeCommand(
			"echo again >> note.txt",
			ctx({ fs: first.fs }),
		);
		expect(second.fs?.["~"]["note.txt"]).toBe("hello world\nagain");
	});

	it("rm needs -r for directories and guards the root", () => {
		expect(text(executeCommand("rm projects", ctx()))).toMatch(
			/Is a directory/,
		);
		expect(executeCommand("rm -r projects", ctx()).fs).not.toHaveProperty(
			"~/projects",
		);
		expect(text(executeCommand("rm -rf /", ctx()))).toMatch(/who hurt you/);
		// Resolved paths: `..`, `~/` and the cwd itself are protected too.
		for (const target of ["..", "~/", "/home/agus/", "."]) {
			const result = executeCommand(
				`rm -r ${target}`,
				ctx({ cwd: "~/projects" }),
			);
			expect(result.fs).toBeUndefined();
		}
	});

	it("ls hides dotfiles unless -a", () => {
		expect(text(executeCommand("ls", ctx()))).not.toMatch(/\.bashrc/);
		expect(text(executeCommand("ls -a", ctx()))).toMatch(/\.bashrc/);
		expect(text(executeCommand("ls", ctx()))).toMatch(/projects\//);
	});

	it("cd validates its target", () => {
		expect(executeCommand("cd projects", ctx()).cwd).toBe("~/projects");
		expect(text(executeCommand("cd README.md", ctx()))).toMatch(
			/Not a directory/,
		);
	});

	it("returns effects for UI commands", () => {
		expect(executeCommand("open blog", ctx()).effect).toEqual({
			type: "open",
			app: "blog",
		});
		expect(executeCommand("close", ctx()).effect).toEqual({ type: "close" });
		expect(executeCommand("lang id", ctx()).effect).toEqual({
			type: "lang",
			locale: "id",
		});
		expect(text(executeCommand("open nope", ctx()))).toMatch(/unknown app/);
		expect(executeCommand("nano a.txt", ctx()).effect).toMatchObject({
			type: "vim",
			dir: "~",
			filename: "a.txt",
		});
	});
});

describe("calendar", () => {
	it("keeps every row on the 4-character grid", () => {
		const rows = calendar(new Date(2026, 9, 10))
			.split("\n")
			.slice(1);
		for (const row of rows)
			expect(row.length % 4 === 0 || row.length % 4 === 3).toBe(true);
		expect(rows.join("\n")).toContain("[10]");
	});
});

describe("complete", () => {
	it("completes commands, paths and apps", () => {
		expect(complete("neo", ctx())).toEqual({ input: "neofetch " });
		expect(complete("cd pro", ctx())).toEqual({ input: "cd projects/" });
		expect(complete("cat projects/po", ctx())).toEqual({
			input: "cat projects/portfolio.md ",
		});
		expect(complete("open bl", ctx())).toEqual({ input: "open blog " });
		expect(complete("c", ctx()).options).toEqual(
			expect.arrayContaining(["cat", "cd", "clear", "close"]),
		);
	});
});
