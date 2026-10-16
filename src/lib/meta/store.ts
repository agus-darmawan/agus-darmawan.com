import "server-only";
import { env } from "@/lib/env";

/**
 * Views and likes per project/post, kept in Redis.
 *
 * Talks to Upstash's REST API with plain fetch (no client library): set
 * UPSTASH_REDIS_REST_URL/TOKEN, or the KV_REST_API_URL/TOKEN that Vercel's
 * Upstash integration creates. Without either the feature is off and the
 * pages simply hide the counts. META_STORE=memory keeps everything in this
 * process instead, for development and the end-to-end tests.
 *
 * Keys, per item (`project:pashupati`):
 *   meta:<item>:views          counter
 *   meta:<item>:likes          set of visitor hashes
 *   meta:<item>:seen:<visitor> exists for a day after a view (dedupe)
 */

export interface MetaCounts {
	views: number;
	likes: number;
	/** Whether this visitor likes it. */
	liked: boolean;
}

export interface MetaStore {
	counts(items: string[], visitor: string | null): Promise<MetaCounts[]>;
	/** Counts a view once per visitor per day. */
	view(item: string, visitor: string): Promise<MetaCounts>;
	like(item: string, visitor: string, liked: boolean): Promise<MetaCounts>;
}

const DAY_SECONDS = 24 * 60 * 60;
const key = (item: string, part: string) => `meta:${item}:${part}`;

// ── Upstash (REST) ───────────────────────────────────────────────────────────

type Command = (string | number)[];

// Sets the dedupe key; only a visitor's first view of the day counts.
const VIEW_SCRIPT = `if redis.call('SET', KEYS[1], '1', 'NX', 'EX', ARGV[1]) then
  return redis.call('INCR', KEYS[2])
end
return tonumber(redis.call('GET', KEYS[2]) or '0')`;

function upstash(url: string, token: string): MetaStore {
	async function pipeline(commands: Command[]): Promise<unknown[]> {
		const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(commands),
			cache: "no-store",
			signal: AbortSignal.timeout(4_000),
		});
		if (!res.ok) throw new Error(`Upstash answered ${res.status}`);
		const replies = (await res.json()) as {
			result?: unknown;
			error?: string;
		}[];
		return replies.map((reply) => {
			if (reply.error) throw new Error(`Upstash: ${reply.error}`);
			return reply.result;
		});
	}

	const toCounts = (views: unknown, likes: unknown, liked: unknown) => ({
		views: Number(views ?? 0) || 0,
		likes: Number(likes ?? 0) || 0,
		liked: Number(liked ?? 0) === 1,
	});

	return {
		async counts(items, visitor) {
			const stride = visitor ? 3 : 2;
			const replies = await pipeline(
				items.flatMap((item): Command[] => [
					["GET", key(item, "views")],
					["SCARD", key(item, "likes")],
					...(visitor ? [["SISMEMBER", key(item, "likes"), visitor]] : []),
				]),
			);
			return items.map((_, i) =>
				toCounts(
					replies[i * stride],
					replies[i * stride + 1],
					visitor ? replies[i * stride + 2] : 0,
				),
			);
		},
		async view(item, visitor) {
			const [views, likes, liked] = await pipeline([
				[
					"EVAL",
					VIEW_SCRIPT,
					2,
					key(item, `seen:${visitor}`),
					key(item, "views"),
					DAY_SECONDS,
				],
				["SCARD", key(item, "likes")],
				["SISMEMBER", key(item, "likes"), visitor],
			]);
			return toCounts(views, likes, liked);
		},
		async like(item, visitor, liked) {
			const [, views, likes] = await pipeline([
				[liked ? "SADD" : "SREM", key(item, "likes"), visitor],
				["GET", key(item, "views")],
				["SCARD", key(item, "likes")],
			]);
			return { ...toCounts(views, likes, 0), liked };
		},
	};
}

// ── In memory (development, tests) ───────────────────────────────────────────

export function memoryStore(now = () => Date.now()): MetaStore {
	const views = new Map<string, number>();
	const likes = new Map<string, Set<string>>();
	const seen = new Map<string, number>();

	const read = (item: string, visitor: string | null): MetaCounts => ({
		views: views.get(item) ?? 0,
		likes: likes.get(item)?.size ?? 0,
		liked: visitor !== null && (likes.get(item)?.has(visitor) ?? false),
	});

	return {
		async counts(items, visitor) {
			return items.map((item) => read(item, visitor));
		},
		async view(item, visitor) {
			const seenKey = `${item}:${visitor}`;
			if ((seen.get(seenKey) ?? 0) <= now()) {
				seen.set(seenKey, now() + DAY_SECONDS * 1000);
				views.set(item, (views.get(item) ?? 0) + 1);
			}
			return read(item, visitor);
		},
		async like(item, visitor, liked) {
			const set = likes.get(item) ?? new Set<string>();
			if (liked) set.add(visitor);
			else set.delete(visitor);
			likes.set(item, set);
			return read(item, visitor);
		},
	};
}

// ── Selection ────────────────────────────────────────────────────────────────

type MetaEnv = Partial<
	Pick<
		typeof env,
		| "META_STORE"
		| "META_SALT"
		| "UPSTASH_REDIS_REST_URL"
		| "UPSTASH_REDIS_REST_TOKEN"
		| "KV_REST_API_URL"
		| "KV_REST_API_TOKEN"
	>
>;

let memory: MetaStore | undefined;

/** The configured store, or null when views and likes are switched off. */
export function getMetaStore(source: MetaEnv = env): MetaStore | null {
	if (source.META_STORE === "memory") {
		memory ??= memoryStore();
		return memory;
	}
	const url = source.UPSTASH_REDIS_REST_URL ?? source.KV_REST_API_URL;
	const token = source.UPSTASH_REDIS_REST_TOKEN ?? source.KV_REST_API_TOKEN;
	return url && token ? upstash(url, token) : null;
}

/** Secret mixed into visitor hashes, so stored ids can't be traced back. */
export function metaSalt(source: MetaEnv = env): string {
	return (
		source.META_SALT ??
		source.UPSTASH_REDIS_REST_TOKEN ??
		source.KV_REST_API_TOKEN ??
		"local-development"
	);
}
