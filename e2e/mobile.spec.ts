import { expect, test } from "@playwright/test";
import { launch, openDesktop, windowNamed } from "./helpers";

test("windows open full screen on phones and stay clear of the dock", async ({
	page,
}) => {
	await openDesktop(page);
	await launch(page, "About Me");
	const win = windowNamed(page, "About Me");
	const viewport = page.viewportSize();
	if (!viewport) throw new Error("no viewport");

	// Poll: the window springs in from 94% scale.
	await expect
		.poll(async () => (await win.boundingBox())?.width)
		.toBeGreaterThanOrEqual(viewport.width - 1);
	const box = await win.boundingBox();
	expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
		viewport.height - 64,
	);
});
