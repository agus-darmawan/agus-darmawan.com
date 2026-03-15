"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const BASE =
	"w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all duration-150 font-[inherit]";

const STYLE = {
	background: "var(--surface-secondary)",
	border: "1px solid var(--border)",
	color: "var(--text-primary)",
} as React.CSSProperties;

const FOCUS_STYLE = {
	borderColor: "#e9542060",
	boxShadow: "0 0 0 2px #e9542018",
};
const BLUR_STYLE = { borderColor: "var(--border)", boxShadow: "none" };

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export function ContactInputField({ label, id, ...props }: InputFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label
					htmlFor={id}
					className="text-[10px] font-semibold uppercase tracking-widest"
					style={{ color: "var(--text-muted)" }}
				>
					{label}
				</label>
			)}
			<input
				id={id}
				className={BASE}
				style={STYLE}
				onFocus={(e) =>
					Object.assign((e.currentTarget as HTMLElement).style, FOCUS_STYLE)
				}
				onBlur={(e) =>
					Object.assign((e.currentTarget as HTMLElement).style, BLUR_STYLE)
				}
				{...props}
			/>
		</div>
	);
}

interface TextareaFieldProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
}

export function ContactTextareaField({
	label,
	id,
	...props
}: TextareaFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label
					htmlFor={id}
					className="text-[10px] font-semibold uppercase tracking-widest"
					style={{ color: "var(--text-muted)" }}
				>
					{label}
				</label>
			)}
			<textarea
				id={id}
				className={`${BASE} resize-none`}
				style={STYLE}
				onFocus={(e) =>
					Object.assign((e.currentTarget as HTMLElement).style, FOCUS_STYLE)
				}
				onBlur={(e) =>
					Object.assign((e.currentTarget as HTMLElement).style, BLUR_STYLE)
				}
				{...props}
			/>
		</div>
	);
}
