import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api";

interface ContactPayload {
	name: string;
	email: string;
	message: string;
}

export async function POST(req: Request) {
	try {
		const body: ContactPayload = await req.json();

		if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
			return NextResponse.json<ApiResponse<null>>(
				{ success: false, data: null, error: "Missing required fields" },
				{ status: 400 },
			);
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
			return NextResponse.json<ApiResponse<null>>(
				{ success: false, data: null, error: "Invalid email address" },
				{ status: 400 },
			);
		}

		if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
			const nodemailer = await import("nodemailer");

			const transporter = nodemailer.createTransport({
				host: env.SMTP_HOST,
				port: env.SMTP_PORT,
				secure: env.SMTP_SECURE,
				auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
			});

			await transporter.sendMail({
				from: `"Portfolio Contact" <${env.SMTP_USER}>`,
				to: env.CONTACT_EMAIL,
				replyTo: `"${body.name}" <${body.email}>`,
				subject: `Portfolio contact from ${body.name}`,
				text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
				html: `
					<h2 style="font-family:sans-serif">New message from your portfolio</h2>
					<p style="font-family:sans-serif"><strong>Name:</strong> ${body.name}</p>
					<p style="font-family:sans-serif"><strong>Email:</strong>
						<a href="mailto:${body.email}">${body.email}</a>
					</p>
					<hr/>
					<p style="font-family:sans-serif;white-space:pre-wrap">${body.message}</p>
				`,
			});
		} else {
			console.log("📬 Contact form (SMTP not configured):");
			console.log("  Name   :", body.name);
			console.log("  Email  :", body.email);
			console.log("  Message:", body.message);
		}

		return NextResponse.json<ApiResponse<{ sent: boolean }>>({
			success: true,
			data: { sent: true },
		});
	} catch (error) {
		console.error("Contact API error:", error);
		return NextResponse.json<ApiResponse<null>>(
			{ success: false, data: null, error: "Failed to send message" },
			{ status: 500 },
		);
	}
}
