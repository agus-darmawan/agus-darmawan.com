/**
 * The generated banner: a robot's patrol plotted on a map grid. A dotted
 * taught route, the solid path the robot actually drove along it, the stops
 * it has passed and the ones ahead, and the robot itself with its sensor
 * cone. Seeded by the item's slug, so every page gets its own route and it
 * never changes between builds.
 *
 * Routes are either a traverse (across the map, either way) or a closed
 * patrol loop that ends where it started.
 *
 * Pure geometry (no React), in a viewBox `height` units tall.
 */

export interface Point {
	x: number;
	y: number;
}

export interface Trajectory {
	width: number;
	height: number;
	/** Grid cell, in viewBox units. */
	cell: number;
	/** The taught route, as a smooth SVG path. */
	taught: string;
	/** What the robot drove so far: wobbles around the route, then stops. */
	driven: string;
	start: Point;
	/** Where the route ends; null for a loop, which ends at the start. */
	goal: Point | null;
	/** Inspection stops along the route; `passed` ones are behind the robot. */
	stops: (Point & { passed: boolean })[];
	robot: Point & { heading: number };
}

const HEIGHT = 400;
/** Samples per spline segment. */
const STEPS = 32;

/** FNV-1a: a stable 32-bit hash of the seed. */
function hash(seed: string) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

/** mulberry32: small, fast, good enough for drawing. */
function random(seed: string) {
	let a = hash(seed);
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Cubic Bézier segments of a Catmull-Rom spline through the points. */
function segments(points: Point[], closed: boolean) {
	const n = points.length;
	const at = (i: number) =>
		closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
	return Array.from({ length: closed ? n : n - 1 }, (_, i) => {
		const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
		return {
			p1,
			c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
			c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
			p2,
		};
	});
}

function bezier(
	{ p1, c1, c2, p2 }: ReturnType<typeof segments>[number],
	t: number,
) {
	const u = 1 - t;
	const a = u * u * u;
	const b = 3 * u * u * t;
	const c = 3 * u * t * t;
	const d = t * t * t;
	return {
		x: a * p1.x + b * c1.x + c * c2.x + d * p2.x,
		y: a * p1.y + b * c1.y + c * c2.y + d * p2.y,
	};
}

/** Across the map, swinging up and down; right to left half the time. */
function traverse(rand: () => number, width: number, height: number) {
	const aspect = width / height;
	const count = Math.max(
		3,
		Math.min(6, Math.round(aspect * 1.4) + (rand() < 0.5 ? 0 : 1)),
	);
	const marginX = Math.max(56, width * 0.07);
	// Wide enough that curve overshoot and the wobble stay inside the band a
	// 2:1 drawing keeps when it fills a 3:1 box (the middle two thirds).
	const marginY = height * 0.25;
	const span = (width - 2 * marginX) / (count - 1);
	const mirrored = rand() < 0.5;
	const points: Point[] = [];
	for (let i = 0; i < count; i++) {
		const jitter =
			i === 0 || i === count - 1 ? 0 : (rand() - 0.5) * span * 0.45;
		let y = marginY + rand() * (height - 2 * marginY);
		const previous = points[i - 1];
		if (previous && Math.abs(y - previous.y) < height * 0.18) {
			y =
				previous.y +
				(previous.y < height / 2 ? 1 : -1) * height * (0.18 + rand() * 0.12);
		}
		y = Math.min(height - marginY, Math.max(marginY, y));
		const x = marginX + i * span + jitter;
		points.push({ x: mirrored ? width - x : x, y });
	}
	return points;
}

/** A patrol: round the middle of the map and back to the start. */
function loop(rand: () => number, width: number, height: number) {
	const count = 5 + Math.floor(rand() * 3);
	const rx = width / 2 - Math.max(64, width * 0.1);
	const ry = height * 0.22;
	const turn = rand() < 0.5 ? 1 : -1;
	const offset = rand() * Math.PI * 2;
	return Array.from({ length: count }, (_, i) => {
		const angle =
			offset + turn * ((i + (rand() - 0.5) * 0.35) / count) * Math.PI * 2;
		const r = 0.85 + rand() * 0.15;
		return {
			x: width / 2 + Math.cos(angle) * rx * r,
			y: height / 2 + Math.sin(angle) * ry * r,
		};
	});
}

export function trajectory(seed: string, aspect: number): Trajectory {
	const rand = random(seed);
	const height = HEIGHT;
	const width = Math.round(HEIGHT * Math.max(1, aspect));

	const closed = rand() < 0.3;
	const waypoints = closed
		? loop(rand, width, height)
		: traverse(rand, width, height);
	const curve = segments(waypoints, closed);
	const taught = `${curve.reduce(
		(d, s) =>
			`${d} C${round(s.c1.x)} ${round(s.c1.y)} ${round(s.c2.x)} ${round(s.c2.y)} ${round(s.p2.x)} ${round(s.p2.y)}`,
		`M${round(waypoints[0].x)} ${round(waypoints[0].y)}`,
	)}${closed ? "Z" : ""}`;

	// Sample the route, then let the driven path weave around it.
	const samples: Point[] = [];
	for (const segment of curve) {
		for (let k = samples.length === 0 ? 0 : 1; k <= STEPS; k++) {
			samples.push(bezier(segment, k / STEPS));
		}
	}
	const lengths = [0];
	for (let i = 1; i < samples.length; i++) {
		const dx = samples[i].x - samples[i - 1].x;
		const dy = samples[i].y - samples[i - 1].y;
		lengths.push(lengths[i - 1] + Math.hypot(dx, dy));
	}
	const total = lengths.at(-1) ?? 0;
	const reach = total * (0.68 + rand() * 0.16);
	const wavelength = 150 + rand() * 120;
	const amplitude = 5 + rand() * 5;
	const phase = rand() * Math.PI * 2;

	const driven: Point[] = [];
	for (let i = 0; i < samples.length && lengths[i] <= reach; i++) {
		const a = samples[Math.max(0, i - 1)];
		const b = samples[Math.min(samples.length - 1, i + 1)];
		const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
		const normal = { x: -(b.y - a.y) / len, y: (b.x - a.x) / len };
		// Starts on the route, settles in as it goes.
		const ease = Math.min(1, lengths[i] / 120);
		const offset =
			ease *
			amplitude *
			Math.sin((lengths[i] / wavelength) * Math.PI * 2 + phase);
		driven.push({
			x: samples[i].x + normal.x * offset,
			y: samples[i].y + normal.y * offset,
		});
	}

	const last = driven.at(-1) ?? waypoints[0];
	const before = driven.at(-4) ?? waypoints[0];
	const heading = Math.atan2(last.y - before.y, last.x - before.x);
	// Waypoint i starts segment i: passed once the robot got that far.
	const passed = (i: number) => lengths[i * STEPS] <= reach;
	const stops = waypoints
		.map((p, i) => ({ ...p, passed: passed(i) }))
		.slice(1, closed ? undefined : -1);

	return {
		width,
		height,
		cell: 40,
		taught,
		driven: driven
			.map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
			.join(""),
		start: waypoints[0],
		goal: closed ? null : (waypoints.at(-1) ?? null),
		stops,
		robot: { ...last, heading },
	};
}
