import { describe, expect, it } from "vitest";
import { trajectory } from "./trajectory";

const numbers = (path: string) =>
	(path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

describe("trajectory", () => {
	it("draws the same route for the same seed, and another for another", () => {
		expect(trajectory("project/pashupati", 2.5)).toEqual(
			trajectory("project/pashupati", 2.5),
		);
		expect(trajectory("project/pashupati", 2.5).taught).not.toBe(
			trajectory("project/pasupasastra", 2.5).taught,
		);
	});

	it("fits the box it is drawn for", () => {
		const seeds = Array.from({ length: 150 }, (_, i) => `seed-${i}`);
		for (const seed of ["project/icar4-its", "blog/x", ...seeds]) {
			for (const aspect of [16 / 9, 2, 2.5, 4]) {
				const t = trajectory(seed, aspect);
				expect(t.width).toBe(Math.round(400 * aspect));
				const xs = numbers(t.driven).filter((_, i) => i % 2 === 0);
				const ys = numbers(t.driven).filter((_, i) => i % 2 === 1);
				expect(Math.min(...xs)).toBeGreaterThan(0);
				expect(Math.max(...xs)).toBeLessThan(t.width);
				// Inside the band that survives trimming a 2:1 drawing to 3:1.
				expect(Math.min(...ys)).toBeGreaterThan(t.height / 6);
				expect(Math.max(...ys)).toBeLessThan((t.height * 5) / 6);
			}
		}
	});

	it("draws both traverses (either way) and closed patrol loops", () => {
		const routes = Array.from({ length: 60 }, (_, i) =>
			trajectory(`seed-${i}`, 2.5),
		);
		const loops = routes.filter((t) => t.goal === null);
		const traverses = routes.filter((t) => t.goal !== null);
		expect(loops.length).toBeGreaterThan(5);
		expect(loops.every((t) => t.taught.endsWith("Z"))).toBe(true);
		expect(traverses.some((t) => t.start.x < (t.goal?.x ?? 0))).toBe(true);
		expect(traverses.some((t) => t.start.x > (t.goal?.x ?? 0))).toBe(true);
	});

	it("puts the robot partway along, with the passed stops behind it", () => {
		for (let i = 0; i < 60; i++) {
			const t = trajectory(`seed-${i}`, 2.5);
			const ahead = t.stops.findIndex((stop) => !stop.passed);
			// Stops are in route order: passed ones first, then the rest.
			if (ahead !== -1) {
				expect(t.stops.slice(ahead).every((stop) => !stop.passed)).toBe(true);
			}
			expect(t.driven.length).toBeGreaterThan(0);
			expect(
				Math.hypot(t.robot.x - t.start.x, t.robot.y - t.start.y),
			).toBeGreaterThan(40);
		}
	});
});
