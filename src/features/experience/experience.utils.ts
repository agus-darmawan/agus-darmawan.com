import type { ExperienceEntry, ExperienceRole } from "./experience.data";

/** Sorts "YYYY-MM" strings; an ongoing role (null end) is the latest. */
const endKey = (end: string | null) => end ?? "9999-12";

export interface CompanySpan {
	entry: ExperienceEntry;
	start: string;
	/** null while any role at the company is ongoing. */
	end: string | null;
	latestRole: ExperienceRole;
}

/** First start, last end and most recent role of one organization. */
export function companySpan(entry: ExperienceEntry): CompanySpan {
	const roles = [...entry.roles].sort(
		(a, b) =>
			endKey(b.period.end).localeCompare(endKey(a.period.end)) ||
			b.period.start.localeCompare(a.period.start),
	);
	const start = roles.map((r) => r.period.start).sort()[0];
	const ongoing = roles.some((r) => r.period.end === null);
	return {
		entry,
		start,
		end: ongoing ? null : roles[0].period.end,
		latestRole: roles[0],
	};
}

/** Organizations ordered by most recent activity, ongoing ones first. */
export const byRecency = (entries: ExperienceEntry[]): CompanySpan[] =>
	entries
		.map(companySpan)
		.sort(
			(a, b) =>
				endKey(b.end).localeCompare(endKey(a.end)) ||
				b.start.localeCompare(a.start),
		);

/** The most recently started ongoing role, if any. */
export function currentRole(entries: ExperienceEntry[]) {
	const ongoing = entries.flatMap((entry) =>
		entry.roles
			.filter((role) => role.period.end === null)
			.map((role) => ({ entry, role })),
	);
	ongoing.sort((a, b) =>
		b.role.period.start.localeCompare(a.role.period.start),
	);
	return ongoing[0] ?? null;
}

/** Totals for the experience page summary line. */
export function experienceSummary(entries: ExperienceEntry[]) {
	const starts = entries.flatMap((e) => e.roles.map((r) => r.period.start));
	return {
		roles: starts.length,
		orgs: entries.length,
		since: Number(starts.sort()[0]?.slice(0, 4)),
	};
}
