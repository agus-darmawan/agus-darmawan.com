import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const FIELD =
	"w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all duration-150 font-[inherit] bg-(--surface-secondary) border-(--border) text-(--text-primary) focus:border-[#e95420]/40 focus:shadow-[0_0_0_2px_#e9542018] disabled:opacity-60";

/** Visually hidden but announced: placeholders alone aren't labels. */
const LABEL = "sr-only";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
}

export function ContactInputField({
	id,
	label,
	className,
	...props
}: InputFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={id} className={LABEL}>
				{label}
			</label>
			<input id={id} className={cn(FIELD, className)} {...props} />
		</div>
	);
}

interface TextareaFieldProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	id: string;
	label: string;
}

export function ContactTextareaField({
	id,
	label,
	className,
	...props
}: TextareaFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={id} className={LABEL}>
				{label}
			</label>
			<textarea
				id={id}
				className={cn(FIELD, "resize-none", className)}
				{...props}
			/>
		</div>
	);
}
