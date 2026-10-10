/**
 * Tiny dependency-free syntax colorizer.
 *
 * Single pass over the RAW source with one alternation regex, escaping every
 * slice exactly once. The previous version chained `.replace()` calls over
 * already-highlighted HTML, so the string regex matched the quotes inside
 * `<span style="color:…">` and produced broken markup for any code with a
 * comment before a string.
 */

const COLORS = {
	comment: "#6272a4",
	string: "#f1fa8c",
	keyword: "#ff79c6",
	number: "#bd93f9",
	tag: "#50fa7b",
} as const;

const JS_LIKE = new Set(["js", "jsx", "ts", "tsx", "javascript", "typescript"]);
const PY_LIKE = new Set(["py", "python"]);
const SH_LIKE = new Set(["sh", "bash", "shell", "zsh", "console"]);
const C_LIKE = new Set(["c", "cpp", "c++", "h", "hpp", "cc"]);

const KEYWORDS: Record<string, string> = {
	js: "const|let|var|function|return|import|export|from|default|class|extends|new|if|else|for|while|async|await|typeof|instanceof|void|null|undefined|true|false|type|interface|enum|as",
	py: "def|class|return|import|from|as|if|elif|else|for|while|in|not|and|or|is|None|True|False|with|try|except|finally|lambda|yield|async|await|self",
	sh: "if|then|else|fi|for|do|done|case|esac|export|source|sudo|cd|echo",
	c: "int|float|double|char|void|bool|auto|const|static|struct|class|public|private|protected|return|if|else|for|while|namespace|using|include|template|typename|nullptr|true|false|new|delete",
};

function familyOf(lang: string): keyof typeof KEYWORDS | null {
	const l = lang.toLowerCase();
	if (JS_LIKE.has(l)) return "js";
	if (PY_LIKE.has(l)) return "py";
	if (SH_LIKE.has(l)) return "sh";
	if (C_LIKE.has(l)) return "c";
	return null;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

const span = (color: string, text: string) =>
	`<span style="color:${color}">${escapeHtml(text)}</span>`;

export function highlight(code: string, lang: string): string {
	const family = familyOf(lang);
	if (!family) return escapeHtml(code);

	const comment =
		family === "py" || family === "sh"
			? String.raw`#.*$`
			: String.raw`\/\/.*$|\/\*[\s\S]*?\*\/`;
	const pattern = new RegExp(
		[
			`(?<comment>${comment})`,
			// '…' and "…" end at the line break (a stray apostrophe in `don't`
			// must not color the rest of the block); template literals may span lines.
			String.raw`(?<string>(["'])(?:\\.|(?!\3)[^\\\n])*\3|\`(?:\\.|[^\\\`])*\`)`,
			`(?<keyword>\\b(?:${KEYWORDS[family]})\\b)`,
			String.raw`(?<number>\b\d+(?:\.\d+)?\b)`,
			// JSX tags only where an element can start — not `i<n` or `Array<string>`.
			...(family === "js"
				? [String.raw`(?<tag>(?<=^|[\s(=>{,;:?&|]|return )<\/?[A-Za-z][\w.]*)`]
				: []),
		].join("|"),
		"gm",
	);

	let out = "";
	let last = 0;
	for (const m of code.matchAll(pattern)) {
		const index = m.index ?? 0;
		out += escapeHtml(code.slice(last, index));
		const kind = (Object.keys(COLORS) as (keyof typeof COLORS)[]).find(
			(k) => m.groups?.[k] !== undefined,
		);
		out += kind ? span(COLORS[kind], m[0]) : escapeHtml(m[0]);
		last = index + m[0].length;
	}
	return out + escapeHtml(code.slice(last));
}
