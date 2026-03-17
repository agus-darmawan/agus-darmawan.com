"use client";

import { useState } from "react";
import type { ApiResponse } from "@/types/api";

export type ContactStatus = "idle" | "sending" | "sent" | "error";

interface UseContactFormOptions {
	onSuccess?: () => void;
}

export function useContactForm({ onSuccess }: UseContactFormOptions = {}) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<ContactStatus>("idle");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

	const reset = () => {
		setName("");
		setEmail("");
		setMessage("");
		setStatus("idle");
		setErrorMsg(null);
		setTurnstileToken(null);
	};

	const submit = async () => {
		if (!name.trim() || !email.trim() || !message.trim()) return;
		if (!turnstileToken) return;
		if (status === "sending" || status === "sent") return;

		setStatus("sending");
		setErrorMsg(null);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message, turnstileToken }),
			});

			const data: ApiResponse<{ sent: boolean }> = await res.json();

			if (data.success) {
				setStatus("sent");
				setName("");
				setEmail("");
				setMessage("");
				setTurnstileToken(null);
				onSuccess?.();
				setTimeout(() => setStatus("idle"), 4_000);
			} else {
				setStatus("error");
				setErrorMsg(data.error ?? "Something went wrong");
				setTimeout(() => setStatus("idle"), 5_000);
			}
		} catch {
			setStatus("error");
			setErrorMsg("Network error — please try again");
			setTimeout(() => setStatus("idle"), 5_000);
		}
	};

	const canSubmit =
		name.trim().length > 0 &&
		email.trim().length > 0 &&
		message.trim().length > 0 &&
		status === "idle" &&
		(!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || turnstileToken !== null);

	return {
		name,
		email,
		message,
		status,
		errorMsg,
		canSubmit,
		turnstileToken,
		setName,
		setEmail,
		setMessage,
		setTurnstileToken,
		submit,
		reset,
	};
}
