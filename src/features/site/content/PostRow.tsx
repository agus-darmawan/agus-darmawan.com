import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { contentPath } from "@/lib/content/paths";
import type { BlogMeta } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { ITEM_TITLE } from "../typography";

/** A post in the writing list: date column, title, summary, reading time. */
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
		<article className="group relative grid gap-x-10 gap-y-1.5 py-6 sm:grid-cols-[9rem_1fr]">
			<p className="text-[0.875rem] text-(--site-muted) tabular-nums sm:pt-0.5">
				<time dateTime={post.date}>
					{formatDate(post.date, locale, "long")}
				</time>
			</p>
			<div className="min-w-0">
				<Heading className={ITEM_TITLE}>
					<Link
						href={contentPath(post)}
						className="decoration-ubuntu-orange decoration-2 underline-offset-[5px] after:absolute after:inset-0 after:content-[''] group-hover:underline"
					>
						{post.title}
					</Link>
				</Heading>
				<p className="mt-1.5 max-w-[65ch] leading-relaxed">
					{post.description}
				</p>
				<p className="mt-2.5 text-[0.8125rem] text-(--site-muted)">
					{t("readTime", { min: post.readingTime })}
				</p>
			</div>
		</article>
	);
}
