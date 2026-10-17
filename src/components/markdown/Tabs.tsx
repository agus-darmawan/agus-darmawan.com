"use client";

import {
	createContext,
	type KeyboardEvent,
	type ReactNode,
	useContext,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

/**
 * `::::tabs` and `:::code-group`: one panel at a time. Panels are rendered
 * on the server like the rest of the article; the tabs only show and hide
 * them, so every panel is still in the HTML for crawlers and find-in-page.
 */

interface TabsState {
	labels: string[];
	active: number;
	base: string;
}

const TabsContext = createContext<TabsState | null>(null);

const parseLabels = (json: string | undefined) => {
	try {
		const labels: unknown = JSON.parse(json ?? "[]");
		return Array.isArray(labels) ? labels.map(String) : [];
	} catch {
		return [];
	}
};

export function Tabs({
	labels: json,
	children,
}: {
	/** JSON array of tab labels, in panel order. */
	labels?: string;
	children: ReactNode;
}) {
	const labels = useMemo(() => parseLabels(json), [json]);
	const [active, setActive] = useState(0);
	const base = useId();
	const buttons = useRef<(HTMLButtonElement | null)[]>([]);

	const onKeyDown = (e: KeyboardEvent) => {
		const last = labels.length - 1;
		const next =
			e.key === "ArrowRight"
				? active === last
					? 0
					: active + 1
				: e.key === "ArrowLeft"
					? active === 0
						? last
						: active - 1
					: e.key === "Home"
						? 0
						: e.key === "End"
							? last
							: null;
		if (next === null) return;
		e.preventDefault();
		setActive(next);
		buttons.current[next]?.focus();
	};

	const state = useMemo(
		() => ({ labels, active, base }),
		[labels, active, base],
	);

	return (
		<div className="md-tabs">
			<div role="tablist" className="md-tablist" onKeyDown={onKeyDown}>
				{labels.map((label, i) => (
					<button
						key={`${label}-${i}`}
						ref={(el) => {
							buttons.current[i] = el;
						}}
						type="button"
						role="tab"
						id={`${base}-tab-${i}`}
						aria-selected={i === active}
						aria-controls={`${base}-panel-${i}`}
						tabIndex={i === active ? 0 : -1}
						onClick={() => setActive(i)}
						className={cn("md-tab", i === active && "md-tab-active")}
					>
						{label}
					</button>
				))}
			</div>
			<TabsContext.Provider value={state}>{children}</TabsContext.Provider>
		</div>
	);
}

/** One panel; hidden unless its tab is selected. */
export function TabPanel({
	index: position,
	children,
}: {
	/** Its place among the panels, as written by the pipeline. */
	index?: string;
	children: ReactNode;
}) {
	const tabs = useContext(TabsContext);
	const index = Number(position);
	if (!tabs || !Number.isInteger(index) || !tabs.labels[index]) {
		return <div>{children}</div>;
	}

	return (
		<div
			role="tabpanel"
			id={`${tabs.base}-panel-${index}`}
			aria-labelledby={`${tabs.base}-tab-${index}`}
			hidden={index !== tabs.active}
			className="md-tabpanel"
		>
			{children}
		</div>
	);
}
