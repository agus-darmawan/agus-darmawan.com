"use client";

interface ReadmeRendererProps {
	content: string;
	accentColor: string;
}

type Token =
	| { type: "h1"; text: string }
	| { type: "h2"; text: string }
	| { type: "h3"; text: string }
	| { type: "p"; text: string }
	| { type: "code_block"; lang: string; code: string }
	| { type: "table"; headers: string[]; rows: string[][] }
	| { type: "ul"; items: string[] }
	| { type: "hr" }
	| { type: "blank" };

function parseMarkdown(raw: string): Token[] {
	const lines = raw.split("\n");
	const tokens: Token[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// Code block
		if (line.trimStart().startsWith("```")) {
			const lang = line.replace(/^```/, "").trim();
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
				codeLines.push(lines[i]);
				i++;
			}
			tokens.push({ type: "code_block", lang, code: codeLines.join("\n") });
			i++;
			continue;
		}

		// Table
		if (line.includes("|") && lines[i + 1]?.includes("---")) {
			const headers = line
				.split("|")
				.map((c) => c.trim())
				.filter(Boolean);
			i += 2; // skip header and separator
			const rows: string[][] = [];
			while (i < lines.length && lines[i].includes("|")) {
				rows.push(
					lines[i]
						.split("|")
						.map((c) => c.trim())
						.filter(Boolean),
				);
				i++;
			}
			tokens.push({ type: "table", headers, rows });
			continue;
		}

		// Headings
		if (line.startsWith("# ")) {
			tokens.push({ type: "h1", text: line.slice(2) });
			i++;
			continue;
		}
		if (line.startsWith("## ")) {
			tokens.push({ type: "h2", text: line.slice(3) });
			i++;
			continue;
		}
		if (line.startsWith("### ")) {
			tokens.push({ type: "h3", text: line.slice(4) });
			i++;
			continue;
		}

		// HR
		if (/^-{3,}$/.test(line.trim())) {
			tokens.push({ type: "hr" });
			i++;
			continue;
		}

		// Unordered list
		if (line.trimStart().startsWith("- ")) {
			const items: string[] = [];
			while (i < lines.length && lines[i].trimStart().startsWith("- ")) {
				items.push(lines[i].trimStart().slice(2));
				i++;
			}
			tokens.push({ type: "ul", items });
			continue;
		}

		// Blank
		if (line.trim() === "") {
			tokens.push({ type: "blank" });
			i++;
			continue;
		}

		// Paragraph
		tokens.push({ type: "p", text: line });
		i++;
	}

	return tokens;
}

function inlineFormat(text: string): string {
	return text
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/`(.+?)`/g, "<code>$1</code>");
}

export function ReadmeRenderer({ content, accentColor }: ReadmeRendererProps) {
	const tokens = parseMarkdown(content);

	return (
		<div
			className="text-sm space-y-2"
			style={{ color: "var(--text-secondary)" }}
		>
			{tokens.map((token, idx) => {
				switch (token.type) {
					case "h1":
						return (
							<h1
								key={idx}
								className="text-lg font-bold mb-1 pb-2 border-b"
								style={{
									color: "var(--text-primary)",
									borderColor: "var(--border)",
								}}
								// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: formatted text
								dangerouslySetInnerHTML={{ __html: inlineFormat(token.text) }}
							/>
						);
					case "h2":
						return (
							<h2
								key={idx}
								className="text-base font-semibold mt-4 mb-1"
								style={{ color: accentColor }}
								// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: formatted text
								dangerouslySetInnerHTML={{ __html: inlineFormat(token.text) }}
							/>
						);
					case "h3":
						return (
							<h3
								key={idx}
								className="text-sm font-semibold mt-3"
								style={{ color: "var(--text-primary)" }}
								// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: formatted text
								dangerouslySetInnerHTML={{ __html: inlineFormat(token.text) }}
							/>
						);
					case "p":
						return (
							<p
								key={idx}
								className="leading-relaxed text-xs"
								// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: formatted text
								dangerouslySetInnerHTML={{ __html: inlineFormat(token.text) }}
							/>
						);
					case "code_block":
						return (
							<pre
								key={idx}
								className="rounded-lg p-3 overflow-x-auto text-xs font-mono"
								style={{
									background: "var(--surface-secondary)",
									border: "1px solid var(--border)",
									color: "#50fa7b",
								}}
							>
								{token.code}
							</pre>
						);
					case "table":
						return (
							<div key={idx} className="overflow-x-auto">
								<table
									className="w-full text-xs border-collapse"
									style={{ borderColor: "var(--border)" }}
								>
									<thead>
										<tr style={{ background: `${accentColor}12` }}>
											{token.headers.map((h, hIdx) => (
												<th
													key={hIdx}
													className="text-left px-3 py-1.5 font-semibold border"
													style={{
														borderColor: "var(--border)",
														color: accentColor,
													}}
												>
													{h}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{token.rows.map((row, rIdx) => (
											<tr key={rIdx}>
												{row.map((cell, cIdx) => (
													<td
														key={cIdx}
														className="px-3 py-1.5 border"
														style={{
															borderColor: "var(--border)",
															color: "var(--text-secondary)",
														}}
														// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: formatted text
														dangerouslySetInnerHTML={{
															__html: inlineFormat(cell),
														}}
													/>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						);
					case "ul":
						return (
							<ul key={idx} className="space-y-1 pl-1">
								{token.items.map((item, iIdx) => (
									<li key={iIdx} className="flex gap-2 text-xs">
										<span
											className="shrink-0 mt-0.5 text-[10px]"
											style={{ color: accentColor }}
										>
											▸
										</span>
										<span
											// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: formatted text
											dangerouslySetInnerHTML={{ __html: inlineFormat(item) }}
										/>
									</li>
								))}
							</ul>
						);
					case "hr":
						return (
							<hr
								key={idx}
								className="my-3"
								style={{ borderColor: "var(--border)" }}
							/>
						);
					default:
						return null;
				}
			})}
		</div>
	);
}
