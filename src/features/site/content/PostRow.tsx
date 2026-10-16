import { useLocale, useTranslations } from "next-intl";
import { Banner } from "@/components/content/banner/Banner";
import { accentStyle } from "@/components/content/primitives";
import { ViewCount } from "@/components/content/stats/ItemStats";
import { Link } from "@/i18n/navigation";
import { contentPath } from "@/lib/content/paths";
import type { BlogMeta } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { itemKey } from "@/lib/meta/keys";
import { cn } from "@/lib/utils";
import { ITEM_TITLE } from "../typography";

/**
 * A post in a list: when, how long, title, summary, tags, and its banner
 * beside it (above it on phones). The whole row is one link.
 */
export function PostRow({
	post,
	headingLevel = 2,
}: {
	post: BlogMeta;
	headingLevel?: 2 | 3;
}) {
	const t = useTranslations("Content");
	const locale = useLocale();
	const Heading = headingLevel === 2 ? "h2" : "h3";

	return (
		<article
			style={accentStyle(post.color)}
			className="group relative grid gap-x-10 gap-y-5 py-7 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-start"
		>
			<div className="min-w-0">
				<p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-(--site-muted)">
					<time dateTime={post.date}>
						{formatDate(post.date, locale, "long")}
					</time>
					<span>{t("readTime", { min: post.readingTime })}</span>
					<ViewCount item={itemKey(post)} />
				</p>
				<Heading className={cn(ITEM_TITLE, "mt-2 text-[1.125rem]")}>
					<Link
						href={contentPath(post)}
						className="decoration-(--accent) decoration-2 underline-offset-[5px] after:absolute after:inset-0 after:content-[''] group-hover:underline"
					>
						{post.title}
					</Link>
				</Heading>
				<p className="mt-1.5 max-w-[65ch] leading-relaxed text-pretty">
					{post.description}
				</p>
				{post.tags.length > 0 && (
					<ul className="mt-3 flex flex-wrap gap-1.5">
						{post.tags.map((tag) => (
							<li
								key={tag}
								className="rounded-md bg-(--site-raised) px-2 py-0.5 text-xs text-(--site-muted)"
							>
								{tag}
							</li>
						))}
					</ul>
				)}
			</div>
			<Banner
				item={post}
				aspect={16 / 9}
				sizes="(min-width: 640px) 13rem, 100vw"
				className="order-first rounded-lg sm:order-none"
			/>
		</article>
	);
}
