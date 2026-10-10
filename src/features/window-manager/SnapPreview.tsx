"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SNAP_STYLES } from "@/constants/window";
import type { SnapZone } from "@/types/app";

/**
 * Semi-transparent overlay showing where the window will snap to.
 * Appears during drag when the cursor is near a screen edge; uses the same
 * geometry as WindowFrame so the preview matches where the window lands.
 */
export function SnapPreview({ zone }: { zone: SnapZone }) {
	return (
		<AnimatePresence>
			{zone && (
				<motion.div
					key={zone}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.1 }}
					className="absolute pointer-events-none rounded-xl z-9990"
					style={{
						...SNAP_STYLES[zone],
						background: "rgba(233, 84, 32, 0.12)",
						border: "2px solid rgba(233, 84, 32, 0.4)",
						backdropFilter: "blur(4px)",
					}}
				/>
			)}
		</AnimatePresence>
	);
}
