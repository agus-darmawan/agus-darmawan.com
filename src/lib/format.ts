/** Locale-aware date formatting (the old BlogCard hardcoded "en-US"). */
export function formatDate(
	iso: string,
	locale: string,
	month: "short" | "long" = "short",
): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
		locale === "id" ? "id-ID" : "en-US",
		{ year: "numeric", month, day: "numeric", timeZone: "UTC" },
	);
}
