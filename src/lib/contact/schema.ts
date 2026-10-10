import { z } from "zod";

// CR/LF and other control characters have no business in a name and would
// end up in mail headers (subject / reply-to display name).
const singleLine = (max: number) =>
	z
		.string()
		.trim()
		.min(1)
		.max(max)
		.refine((v) => !/[\u0000-\u001f\u007f]/.test(v), "Invalid characters");

export const CONTACT_LIMITS = {
	name: 100,
	email: 254,
	message: 5_000,
} as const;

export const contactSchema = z.object({
	name: singleLine(CONTACT_LIMITS.name),
	email: z.email().max(CONTACT_LIMITS.email),
	message: z.string().trim().min(1).max(CONTACT_LIMITS.message),
	turnstileToken: z.string().max(2_048).optional(),
	/** Honeypot — real users never see or fill it (checked by the route). */
	website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Error codes returned by POST /api/contact (translated client-side). */
export type ContactErrorCode =
	| "invalid_input"
	| "rate_limited"
	| "verification_failed"
	| "not_configured"
	| "send_failed";
