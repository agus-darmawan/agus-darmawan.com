/**
 * Minimal JSON fetch helper (replaces axios — one less dependency with a
 * steady stream of CVEs, and native fetch already does everything we need).
 */
export class HttpError extends Error {
	constructor(
		readonly status: number,
		message: string,
	) {
		super(message);
		this.name = "HttpError";
	}
}

export async function fetchJson<T>(
	input: string | URL,
	init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
	const { timeoutMs = 10_000, ...rest } = init;
	const res = await fetch(input, {
		cache: "no-store",
		...rest,
		signal: rest.signal ?? AbortSignal.timeout(timeoutMs),
	});
	if (!res.ok)
		throw new HttpError(res.status, `${res.status} ${res.statusText}`);
	return (await res.json()) as T;
}
