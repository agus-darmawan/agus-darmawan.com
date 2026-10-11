import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `false` during SSR and hydration, `true` afterwards — for client-only UI. */
export const useMounted = () =>
	useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
