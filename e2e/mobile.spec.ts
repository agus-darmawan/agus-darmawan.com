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

test("the website fits a phone and its menu navigates", async ({ page }) => {
	for (const path of ["/en", "/en/experience", "/en/projects", "/en/contact"]) {
		await page.goto(path);
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth -
				document.documentElement.clientWidth,
		);
		expect(overflow, path).toBe(0);
	}

	await page.goto("/en");
	await page.getByRole("button", { name: "Open menu" }).click();
	await page
		.getByRole("navigation", { name: "Main" })
		.getByRole("link", { name: "Experience" })
		.click();
	await expect(page).toHaveURL(/\/en\/experience$/);
	await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});
