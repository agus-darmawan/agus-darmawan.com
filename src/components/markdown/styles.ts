/**
 * Two typographic scales for the same markdown:
 * compact     — inside desktop windows (small, dense)
 * comfortable — standalone article pages (reading size, ~70ch measure)
 */
export type MarkdownSize = "compact" | "comfortable";

export const MARKDOWN_STYLES = {
	compact: {
		h1: "text-lg font-bold mb-2 mt-5 first:mt-0 pb-2 border-b border-(--border) text-(--text-primary)",
		h2: "text-sm font-semibold mt-5 mb-2 text-(--accent)",
		h3: "text-xs font-semibold mt-4 mb-1 text-(--text-primary)",
		p: "text-xs leading-relaxed my-1.5 text-(--text-secondary)",
		quote:
			"pl-3 my-3 text-xs italic border-l-3 border-(--accent) text-(--text-muted)",
		tableWrap: "overflow-x-auto my-3",
		table: "w-full text-xs border-collapse",
		cell: "px-3 py-1.5 border border-(--border)",
		list: "my-2 space-y-1 pl-1",
		item: "flex gap-2 text-xs text-(--text-secondary)",
		bullet: "shrink-0 mt-0.5 text-[10px] text-(--accent)",
		hr: "my-4 border-(--border)",
		code: "text-xs",
		body: "flex-1 min-w-0",
		layout: "flex gap-5 min-w-0",
		toc: "w-44 top-0",
		tocTitle:
			"text-[10px] font-semibold uppercase tracking-widest mb-2 text-(--text-muted)",
		tocLink: "text-[11px] py-0.5",
	},
	comfortable: {
		h1: "text-[1.5rem] font-light leading-tight mt-10 mb-4 first:mt-0 pb-3 border-b border-(--border) text-(--text-primary)",
		h2: "text-[1.3125rem] font-medium leading-snug mt-10 mb-3 first:mt-0 text-(--text-primary)",
		h3: "text-[1.0625rem] font-medium mt-7 mb-2.5 text-(--text-primary)",
		p: "text-base leading-[1.75] my-4 text-(--text-secondary)",
		quote:
			"pl-5 my-5 text-base italic border-l-3 border-(--accent) text-(--text-muted)",
		tableWrap: "overflow-x-auto my-7",
		table: "w-full text-sm border-collapse",
		cell: "px-3.5 py-2 border border-(--border)",
		list: "my-4 space-y-2 pl-1",
		item: "flex gap-3 text-base leading-[1.7] text-(--text-secondary)",
		bullet: "shrink-0 mt-[0.45em] text-[0.625rem] text-(--accent)",
		hr: "my-10 border-(--border)",
		code: "text-[0.8125rem]",
		body: "flex-1 min-w-0 max-w-[42rem]",
		layout: "flex gap-14 min-w-0",
		toc: "w-52 top-20",
		tocTitle: "text-[0.8125rem] font-medium mb-2.5 text-(--text-primary)",
		tocLink: "text-[0.8125rem] py-1",
	},
} satisfies Record<MarkdownSize, Record<string, string>>;
