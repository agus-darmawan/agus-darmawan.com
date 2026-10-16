"use client";

import { Eye, Heart } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { cn } from "@/lib/utils";
import { type Counts, useCountsList, useItemCounts, useLike } from "./useStats";

/** Views and likes of the item being read, as more pairs for a meta row. */
export function ItemStats({ item }: { item: string }) {
	const t = useTranslations("Content");
	const { data } = useItemCounts(item);
	if (!data) return null;

	// Zeros say nothing yet; the like button invites the first like.
	return (
		<>
			{data.views > 0 && (
				<span className="flex items-center gap-[0.35em]">
					<Eye aria-hidden="true" />
					{t("views", { count: data.views })}
				</span>
			)}
			{data.likes > 0 && (
				<span className="flex items-center gap-[0.35em]">
					<Heart aria-hidden="true" />
					{t("likes", { count: data.likes })}
				</span>
			)}
		</>
	);
}

/**
 * The like button at the end of an article. Its label stays "Like"; the
 * filled heart and `aria-pressed` say whether you do. The heart pops once
 * when you like it (the only animation on the page).
 */
export function LikeButton({
	item,
	className,
}: {
	item: string;
	className?: string;
}) {
	const t = useTranslations("Content");
	const format = useFormatter();
	const { data } = useItemCounts(item);
	const like = useLike(item);
	const [popped, setPopped] = useState(false);

	useEffect(() => {
		if (!popped) return;
		const id = setTimeout(() => setPopped(false), 450);
		return () => clearTimeout(id);
	}, [popped]);

	if (!data) return null;

	return (
		<button
			type="button"
			aria-pressed={data.liked}
			onClick={() => {
				if (!data.liked) setPopped(true);
				like.mutate(!data.liked);
			}}
			className={cn(
				"group inline-flex h-10 items-center gap-2.5 rounded-full border pl-3.5 pr-4 text-sm font-medium transition-colors",
				data.liked
					? "border-(--accent) text-(--text-primary)"
					: "border-(--border) text-(--text-primary) hover:border-(--text-primary)",
				className,
			)}
		>
			<Heart
				aria-hidden="true"
				className={cn(
					"size-[1.125rem] transition-colors",
					data.liked
						? "fill-(--accent) text-(--accent)"
						: "text-(--text-muted) group-hover:text-(--accent)",
					popped && "animate-like-pop",
				)}
			/>
			{t("like")}
			<span className="border-l border-(--border) pl-2.5 tabular-nums text-(--text-muted)">
				<span className="sr-only">{t("likes", { count: data.likes })}</span>
				<span aria-hidden="true">{format.number(data.likes)}</span>
			</span>
		</button>
	);
}

// ── Lists ────────────────────────────────────────────────────────────────────

const ListCounts = createContext<Record<string, Counts> | null | undefined>(
	undefined,
);

/** Fetches the counts of every item in a list once, for its `ViewCount`s. */
export function StatsScope({
	items,
	children,
}: {
	items: string[];
	children: ReactNode;
}) {
	const { data } = useCountsList(items);
	return <ListCounts.Provider value={data}>{children}</ListCounts.Provider>;
}

/** An item's views on a card; nothing until there are some. */
export function ViewCount({
	item,
	icon,
	className,
}: {
	item: string;
	/** With an eye, to sit among other icon + text pairs. */
	icon?: boolean;
	className?: string;
}) {
	const t = useTranslations("Content");
	const counts = useContext(ListCounts)?.[item];
	if (!counts?.views) return null;

	return (
		<span className={cn("flex items-center gap-1 tabular-nums", className)}>
			{icon && <Eye aria-hidden="true" size={10} />}
			{t("views", { count: counts.views })}
		</span>
	);
}
