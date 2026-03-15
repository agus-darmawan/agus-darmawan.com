import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api";

export interface ContactPayload {
	name: string;
	email: string;
	message: string;
}

export async function POST(req: Request) {
	try {
		const body: ContactPayload = await req.json();

		if (!body.name || !body.email || !body.message) {
			const response: ApiResponse<null> = {
				success: false,
				data: null,
				error: "Missing required fields",
			};
			return NextResponse.json(response, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(body.email)) {
			const response: ApiResponse<null> = {
				success: false,
				data: null,
				error: "Invalid email address",
			};
			return NextResponse.json(response, { status: 400 });
		}

		// ── Send via Resend (or any other provider) ──────────────────────
		// If RESEND_API_KEY is set, use Resend. Otherwise log to console
		// (useful for local dev without setting up email).
		const resendKey = env.RESEND_API_KEY;
		const contactEmail = env.CONTACT_RECEIVER_EMAIL;

		if (resendKey) {
			const res = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${resendKey}`,
				},
				body: JSON.stringify({
					from: "Portfolio Contact <onboarding@resend.dev>",
					to: contactEmail,
					reply_to: body.email,
					subject: `Portfolio contact from ${body.name}`,
					html: `
						<h2>New message from your portfolio</h2>
						<p><strong>Name:</strong> ${body.name}</p>
						<p><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
						<hr />
						<p>${body.message.replace(/\n/g, "<br/>")}</p>
					`,
				}),
			});

			if (!res.ok) {
				const err = await res.text();
				console.error("Resend error:", err);
				throw new Error("Email delivery failed");
			}
		} else {
			// Dev fallback — log to console
			console.log("📬 Contact form submission (no RESEND_API_KEY set):");
			console.log("  Name:", body.name);
			console.log("  Email:", body.email);
			console.log("  Message:", body.message);
		}

		const response: ApiResponse<{ sent: boolean }> = {
			success: true,
			data: { sent: true },
		};
		return NextResponse.json(response);
	} catch (error) {
		console.error("Contact API error:", error);
		const response: ApiResponse<null> = {
			success: false,
			data: null,
			error: "Failed to send message",
		};
		return NextResponse.json(response, { status: 500 });
	}
}
