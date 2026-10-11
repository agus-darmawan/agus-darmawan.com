import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { contentPath } from "@/lib/content/paths";
import type { BlogMeta } from "@/lib/content/types";
import { formatDate } from "@/lib/format";

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
		<article className="group relative grid gap-x-10 gap-y-2 py-7 sm:grid-cols-[10rem_1fr]">
			<p className="text-(--site-muted) tabular-nums">
				<time dateTime={post.date}>
					{formatDate(post.date, locale, "long")}
				</time>
			</p>
			<div className="min-w-0">
				<Heading className="text-xl font-medium leading-snug text-(--site-ink)">
					<Link
						href={contentPath(post)}
						className="decoration-ubuntu-orange decoration-2 underline-offset-[5px] after:absolute after:inset-0 after:content-[''] group-hover:underline"
					>
						{post.title}
					</Link>
				</Heading>
				<p className="mt-2 max-w-[65ch] leading-relaxed">{post.description}</p>
				<p className="mt-3 text-sm text-(--site-muted)">
					{t("readTime", { min: post.readingTime })}
				</p>
			</div>
		</article>
	);
}
