"use client";

import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";
import type { ContactErrorCode } from "@/lib/contact/schema";
import type { ApiResponse } from "@/types/api";

type Status = "idle" | "sending" | "sent" | "error";
export type ContactFailure = ContactErrorCode | "network";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const FEEDBACK_MS = 5_000;

export function useContactForm() {
	const [fields, setFields] = useState({ name: "", email: "", message: "" });
	const [website, setWebsite] = useState(""); // honeypot
	const [status, setStatus] = useState<Status>("idle");
	const [failure, setFailure] = useState<ContactFailure | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

	// Success/error feedback fades back to idle; cleared if the form unmounts.
	useEffect(() => {
		if (status !== "sent" && status !== "error") return;
		const id = setTimeout(() => setStatus("idle"), FEEDBACK_MS);
		return () => clearTimeout(id);
	}, [status]);

	const setField = (key: keyof typeof fields) => (value: string) =>
		setFields((prev) => ({ ...prev, [key]: value }));

	const filled = Object.values(fields).every((v) => v.trim().length > 0);
	// Only wait for a token when Turnstile is actually configured — before,
	// a missing site key left the button enabled but submit() did nothing.
	const verified = !TURNSTILE_SITE_KEY || token !== null;
	const canSubmit = filled && verified && status !== "sending";

	const submit = async () => {
		if (!canSubmit) return;
		setStatus("sending");
		setFailure(null);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...fields,
					website,
					turnstileToken: token ?? undefined,
				}),
			});
			const data = (await res.json()) as ApiResponse<{ sent: boolean }>;

			if (data.success) {
				setFields({ name: "", email: "", message: "" });
				setStatus("sent");
			} else {
				setFailure((data.code as ContactErrorCode) ?? "send_failed");
				setStatus("error");
			}
		} catch {
			setFailure("network");
			setStatus("error");
		} finally {
			// A Turnstile token is single-use: always get a fresh one, otherwise
			// every retry (and the next message) fails verification.
			setToken(null);
			turnstileRef.current?.reset();
		}
	};

	return {
		fields,
		setField,
		website,
		setWebsite,
		status,
		failure,
		canSubmit,
		submit,
		turnstile: {
			siteKey: TURNSTILE_SITE_KEY,
			ref: turnstileRef,
			onToken: setToken,
		},
	};
}
