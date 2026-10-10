import { NextResponse } from "next/server";
import {
	type ContactErrorCode,
	type ContactInput,
	contactSchema,
} from "@/lib/contact/schema";
import { env } from "@/lib/env";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import type { ApiResponse } from "@/types/api";

const rateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

const isSmtpConfigured = Boolean(
	env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS,
);

function fail(
	code: ContactErrorCode,
	error: string,
	status: number,
	headers?: HeadersInit,
) {
	return NextResponse.json<ApiResponse<null>>(
		{ success: false, data: null, code, error },
		{ status, headers },
	);
}

const ok = () =>
	NextResponse.json<ApiResponse<{ sent: true }>>({
		success: true,
		data: { sent: true },
	});

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;");
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
	if (!env.TURNSTILE_SECRET_KEY) return true;
	const body = new FormData();
	body.append("secret", env.TURNSTILE_SECRET_KEY);
	body.append("response", token);
	if (ip !== "unknown") body.append("remoteip", ip);

	try {
		const res = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{ method: "POST", body, signal: AbortSignal.timeout(8_000) },
		);
		return ((await res.json()) as { success: boolean }).success === true;
	} catch {
		return false;
	}
}

async function sendMail({ name, email, message }: ContactInput) {
	const nodemailer = await import("nodemailer");
	const transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.SMTP_SECURE,
		auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
	});

	await transporter.sendMail({
		from: { name: "Portfolio Contact", address: env.SMTP_USER ?? "" },
		to: env.CONTACT_EMAIL,
		// Address objects: nodemailer encodes them, so a crafted name or
		// address can't inject extra recipients/headers.
		replyTo: { name, address: email },
		// Headers are plain text — HTML-escaping them showed "O&#x27;Brien".
		subject: `Portfolio contact from ${name}`,
		text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
		html: `<h2 style="font-family:sans-serif">New message from your portfolio</h2>
<p style="font-family:sans-serif"><strong>Name:</strong> ${escapeHtml(name)}</p>
<p style="font-family:sans-serif"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<hr/>
<p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(message)}</p>`,
	});
}

export async function POST(req: Request) {
	const ip = clientIp(req.headers);
	const limit = rateLimit(ip);
	if (!limit.ok) {
		return fail("rate_limited", "Too many requests", 429, {
			"Retry-After": String(limit.retryAfterSeconds),
		});
	}

	const parsed = contactSchema.safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return fail("invalid_input", "Invalid name, email or message", 400);
	}
	const input = parsed.data;

	// Honeypot filled → a bot. Pretend success so it doesn't adapt.
	if (input.website) return ok();

	if (
		env.TURNSTILE_SECRET_KEY &&
		!(input.turnstileToken && (await verifyTurnstile(input.turnstileToken, ip)))
	) {
		return fail("verification_failed", "Bot verification failed", 400);
	}

	if (!isSmtpConfigured) {
		if (process.env.NODE_ENV !== "production") {
			console.info("📬 Contact form (SMTP not configured):", {
				name: input.name,
				email: input.email,
			});
			return ok();
		}
		// Never tell a visitor "sent" when the message goes nowhere.
		return fail("not_configured", "Contact form is not configured", 503);
	}

	try {
		await sendMail(input);
		return ok();
	} catch (error) {
		console.error("Contact API error:", error);
		return fail("send_failed", "Failed to send message", 502);
	}
}
