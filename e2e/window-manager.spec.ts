import { expect, test } from "@playwright/test";
import { dock, launch, openDesktop, windowNamed } from "./helpers";

test.beforeEach(async ({ page }) => openDesktop(page));

test("closing a maximized window closes it (doesn't shrink it)", async ({
	page,
}) => {
	await launch(page, "About Me");
	const win = windowNamed(page, "About Me");
	await win.getByRole("button", { name: "Maximize" }).click();
	await win.getByRole("button", { name: "Close" }).click();
	await expect(win).toHaveCount(0);
});

test("dragging to the top edge snaps full screen; restore takes one click", async ({
	page,
}) => {
	await launch(page, "About Me");
	const win = windowNamed(page, "About Me");
	// Let the open animation settle before grabbing the title bar.
	await expect.poll(async () => (await win.boundingBox())?.width).toBe(900);
	const bar = win.locator(".window-titlebar");
	const box = await bar.boundingBox();
	if (!box) throw new Error("no title bar");
	await page.mouse.move(box.x + 300, box.y + 15);
	await page.mouse.down();
	await page.mouse.move(600, 200, { steps: 6 });
	await page.mouse.move(600, 20, { steps: 6 });
	await page.mouse.up();

	await expect
		.poll(async () => (await win.boundingBox())?.width)
		.toBeGreaterThan(1300);
	await win.getByRole("button", { name: "Restore" }).click();
	await expect
		.poll(async () => (await win.boundingBox())?.width)
		.toBeLessThan(1000);
});

test("minimize keeps the app mounted and restores its state", async ({
	page,
}) => {
	await launch(page, "Terminal");
	const input = page.getByRole("textbox", { name: "Command" });
	await input.fill("echo still here");
	await input.press("Enter");

	const win = windowNamed(page, "Terminal");
	await win.getByRole("button", { name: "Minimize" }).click();
	await expect(win).toBeHidden();

	await dock(page)
		.getByRole("button", { name: "Terminal", exact: true })
		.click();
	await expect(win).toBeVisible();
	await expect(page.getByRole("log")).toContainText("still here");
});

test("menus and the app grid paint above windows", async ({ page }) => {
	await launch(page, "About Me");
	await windowNamed(page, "About Me")
		.getByRole("button", { name: "Maximize" })
		.click();

	await page.getByRole("button", { name: "System menu" }).click();
	const menu = page.getByRole("dialog", { name: "System menu" });
	await expect(menu).toBeVisible();
	const box = await menu.boundingBox();
	if (!box) throw new Error("no menu");
	const onTop = await page.evaluate(
		([x, y]) =>
			document.elementFromPoint(x, y)?.closest("[role=dialog]") !== null,
		[box.x + box.width / 2, box.y + box.height / 2],
	);
	expect(onTop).toBe(true);
	await page.keyboard.press("Escape");
	await expect(menu).toHaveCount(0);

	await dock(page).getByRole("button", { name: "Show Apps" }).click();
	await page.keyboard.press("Escape");
	await expect(windowNamed(page, "About Me")).toBeVisible();
});

test("a project opens inside the Projects window, not a new tab", async ({
	page,
	context,
}) => {
	await launch(page, "Projects");
	const win = windowNamed(page, "Projects");
	const pages = context.pages().length;

	await win.getByRole("link").first().click();
	await expect(win.getByRole("button", { name: "All projects" })).toBeVisible();
	await expect(win.getByRole("heading", { level: 2 }).first()).toBeVisible();
	expect(page.url()).toMatch(/\/en\/desktop$/);
	expect(context.pages()).toHaveLength(pages);
});

test("command palette launches apps", async ({ page }) => {
	// Start with focus inside another app: it must not jump back on top.
	await launch(page, "Terminal");
	await page.getByRole("textbox", { name: "Command" }).focus();

	const palette = page.getByRole("dialog", { name: "Command palette" });
	// The shortcut listener attaches after hydration; retry until it's live.
	await expect(async () => {
		if (!(await palette.isVisible())) await page.keyboard.press("Control+k");
		await expect(palette).toBeVisible({ timeout: 1_000 });
	}).toPass();
	// The search box takes focus a frame after the dialog paints; typing
	// before that would land in the terminal.
	await expect(palette.getByRole("combobox")).toBeFocused();
	await page.keyboard.type("blog");
	await page.keyboard.press("Enter");
	await expect(windowNamed(page, "Blog")).toBeVisible();
	await expect(palette).toHaveCount(0);
	const z = (name: string) =>
		windowNamed(page, name).evaluate((el) =>
			Number((el as HTMLElement).style.zIndex),
		);
	await expect
		.poll(async () => (await z("Blog")) > (await z("Terminal")))
		.toBe(true);
});

test("the app grid brings an active app forward instead of minimizing it", async ({
	page,
}) => {
	await launch(page, "About Me");
	await dock(page).getByRole("button", { name: "Show Apps" }).click();
	await page
		.getByRole("dialog", { name: "Show Apps" })
		.getByRole("button", { name: "About Me" })
		.click();
	await expect(windowNamed(page, "About Me")).toBeVisible();
});
