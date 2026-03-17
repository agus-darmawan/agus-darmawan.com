// src/features/window-manager/SnapPreview.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SnapPreviewProps {
	snapPreview: {
		snapped: boolean;
		x: number;
		y: number;
		width?: string;
		height?: string;
	} | null;
}

/**
 * Semi-transparent overlay showing where the window will snap to.
 * Appears during drag when cursor is near a screen edge.
 */
export function SnapPreview({ snapPreview }: SnapPreviewProps) {
	return (
		<AnimatePresence>
			{snapPreview && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.1 }}
					className="absolute pointer-events-none rounded-xl z-9990"
					style={{
						left: snapPreview.x,
						top: snapPreview.y,
						width: snapPreview.width ?? "50vw",
						height: snapPreview.height ?? "calc(100vh - 32px)",
						background: "rgba(233, 84, 32, 0.12)",
						border: "2px solid rgba(233, 84, 32, 0.4)",
						backdropFilter: "blur(4px)",
					}}
				/>
			)}
		</AnimatePresence>
	);
}
