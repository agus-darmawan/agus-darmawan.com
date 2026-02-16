"use client";

import { Maximize2, Minimize2, X } from "lucide-react";

interface WindowHeaderProps {
	title: string;
	isActive: boolean;
	isMaximized: boolean;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

export function WindowHeader({
	title,
	isActive,
	isMaximized,
	onClose,
	onMinimize,
	onMaximize,
}: WindowHeaderProps) {
	return (
		<div
			className={[
				"window-titlebar h-9 flex items-center justify-between px-3 select-none",
				isActive ? "bg-(--window-header-active)" : "bg-(--window-header)",
				!isMaximized ? "cursor-grab active:cursor-grabbing" : "",
			].join(" ")}
		>
			<div className="flex items-center gap-2">
				<div className="flex gap-2">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onClose();
						}}
						className="w-4 h-4 bg-[#f46067] hover:bg-[#f68086] rounded-full flex items-center justify-center group transition-colors"
						title="Close"
					>
						<X
							size={10}
							className="text-[#2d0922] opacity-0 group-hover:opacity-100 transition-opacity"
						/>
					</button>

					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onMinimize();
						}}
						className="w-4 h-4 bg-[#f6a847] hover:bg-[#f8b867] rounded-full flex items-center justify-center group transition-colors"
						title="Minimize"
					>
						<Minimize2
							size={8}
							className="text-[#2d0922] opacity-0 group-hover:opacity-100 transition-opacity"
						/>
					</button>

					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onMaximize();
						}}
						className="w-4 h-4 bg-[#64c550] hover:bg-[#84d570] rounded-full flex items-center justify-center group transition-colors"
						title={isMaximized ? "Restore" : "Maximize"}
					>
						<Maximize2
							size={8}
							className="text-[#2d0922] opacity-0 group-hover:opacity-100 transition-opacity"
						/>
					</button>
				</div>
				<span className="text-sm font-medium ml-2 text-(--text-primary)]">
					{title}
				</span>
			</div>
		</div>
	);
}
