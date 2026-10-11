import { describe, expect, it } from "vitest";
import type { ExperienceEntry } from "./experience.data";
import {
	byRecency,
	companySpan,
	currentRole,
	experienceSummary,
} from "./experience.utils";

const entry = (
	i18nKey: string,
	roles: [string, string, string | null][],
): ExperienceEntry => ({
	i18nKey,
	color: "#000",
	roles: roles.map(([key, start, end]) => ({
		i18nKey: key,
		period: { start, end } as ExperienceEntry["roles"][number]["period"],
		tech: [],
	})),
});

const data = [
	entry("lab", [["assistant", "2024-06", "2025-08"]]),
	entry("ezra", [
		["junior", "2024-12", "2025-11"],
		["engineer", "2025-11", null],
	]),
	entry("team", [
		["leader", "2023-12", "2024-11"],
		["member", "2022-04", "2023-12"],
	]),
];

describe("experience utils", () => {
	it("spans a company from its first start to its last end", () => {
		expect(companySpan(data[2])).toMatchObject({
			start: "2022-04",
			end: "2024-11",
			latestRole: { i18nKey: "leader" },
		});
		expect(companySpan(data[1])).toMatchObject({
			start: "2024-12",
			end: null,
			latestRole: { i18nKey: "engineer" },
		});
	});

	it("orders companies by recency, ongoing first", () => {
		expect(byRecency(data).map((s) => s.entry.i18nKey)).toEqual([
			"ezra",
			"lab",
			"team",
		]);
	});

	it("finds the current role", () => {
		expect(currentRole(data)?.role.i18nKey).toBe("engineer");
		expect(currentRole([data[0]])).toBeNull();
	});

	it("summarizes roles, organizations and the first year", () => {
		expect(experienceSummary(data)).toEqual({ roles: 5, orgs: 3, since: 2022 });
	});
});
