import { HOME } from "./lines";
import type { FileSystem } from "./types";

export const INITIAL_FS: FileSystem = {
	"~": {
		".bashrc":
			"# ~/.bashrc\nexport PS1='agus@ubuntu:\\w$ '\nexport PATH=$PATH:/usr/local/bin\nalias ll='ls -la'\nalias gs='git status'",
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

/**
 * Resolve `arg` against `cwd` into a normalized "~"-rooted path:
 * handles `~`, `/home/agus`, `.`, `..` and trailing slashes.
 */
export function resolvePath(cwd: string, arg = "~"): string {
	let path = arg.trim() || "~";
	if (path === HOME || path.startsWith(`${HOME}/`)) {
		path = `~${path.slice(HOME.length)}`;
	}

	const absolute =
		path === "~" || path.startsWith("~/") || path.startsWith("/");
	const segments = (absolute ? path : `${cwd}/${path}`).split("/");
	const root = segments[0] === "" ? "" : segments.shift();
	const out: string[] = [];

	for (const segment of segments) {
		if (!segment || segment === ".") continue;
		if (segment === "..") out.pop();
		else out.push(segment);
	}

	if (root === "") return `/${out.join("/")}`;
	return [root, ...out].join("/");
}

export const isDir = (fs: FileSystem, path: string) => Object.hasOwn(fs, path);

/** Split a path into its parent directory and base name. */
export function splitPath(cwd: string, arg: string) {
	const full = resolvePath(cwd, arg);
	const slash = full.lastIndexOf("/");
	return {
		dir: full.slice(0, slash) || "/",
		name: full.slice(slash + 1),
		full,
	};
}

export function readFile(fs: FileSystem, dir: string, name: string) {
	const files = fs[dir];
	return files && Object.hasOwn(files, name) ? files[name] : undefined;
}

export const writeFile = (
	fs: FileSystem,
	dir: string,
	name: string,
	content: string,
): FileSystem => ({ ...fs, [dir]: { ...fs[dir], [name]: content } });

export function removeFile(
	fs: FileSystem,
	dir: string,
	name: string,
): FileSystem {
	const { [name]: _removed, ...rest } = fs[dir] ?? {};
	return { ...fs, [dir]: rest };
}

/** Remove a directory and everything below it. */
export const removeDir = (fs: FileSystem, path: string): FileSystem =>
	Object.fromEntries(
		Object.entries(fs).filter(
			([key]) => key !== path && !key.startsWith(`${path}/`),
		),
	);

/** Immediate sub-directories of `path`, by name. */
export const subdirs = (fs: FileSystem, path: string) =>
	Object.keys(fs)
		.filter((key) => key.startsWith(`${path}/`))
		.map((key) => key.slice(path.length + 1))
		.filter((rest) => rest && !rest.includes("/"));

/** Display form of a "~" path, e.g. for `pwd`. */
export const toAbsolute = (path: string) =>
	path === "~" || path.startsWith("~/") ? `${HOME}${path.slice(1)}` : path;
