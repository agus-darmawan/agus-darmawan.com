import { useLocale, useTranslations } from "next-intl";
import { formatYearMonth } from "@/lib/format";

/** "Nov 2024 – Present", with machine-readable dates. */
export function Period({ start, end }: { start: string; end: string | null }) {
	const t = useTranslations("ExperienceWindow");
	const locale = useLocale();

	return (
		<>
			<time dateTime={start}>{formatYearMonth(start, locale)}</time>
			{" – "}
			{end ? (
				<time dateTime={end}>{formatYearMonth(end, locale)}</time>
			) : (
				t("present")
			)}
		</>
	);
}
