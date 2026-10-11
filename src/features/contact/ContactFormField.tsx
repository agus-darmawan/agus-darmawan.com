import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const FIELD =
	"w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all duration-150 font-[inherit] bg-(--surface-secondary) border-(--border) text-(--text-primary) focus:border-[#e95420]/40 focus:shadow-[0_0_0_2px_#e9542018] disabled:opacity-60";

/**
 * Labels are always announced (placeholders alone aren't labels); the
 * compact window form hides them visually, the contact page shows them.
 */
const labelClass = (visible: boolean) =>
	visible ? "text-sm font-medium text-(--text-primary)" : "sr-only";

interface FieldLabelProps {
	id: string;
	label: string;
	labelVisible?: boolean;
}

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> &
	FieldLabelProps;

export function ContactInputField({
	id,
	label,
	labelVisible = false,
	className,
	...props
}: InputFieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className={labelClass(labelVisible)}>
				{label}
			</label>
			<input id={id} className={cn(FIELD, className)} {...props} />
		</div>
	);
}

type TextareaFieldProps = Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	"id"
> &
	FieldLabelProps;

export function ContactTextareaField({
	id,
	label,
	labelVisible = false,
	className,
	...props
}: TextareaFieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className={labelClass(labelVisible)}>
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
